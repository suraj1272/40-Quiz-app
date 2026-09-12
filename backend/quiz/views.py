from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .questions_data import QUESTIONS, EXAM_CONFIG
from .serializers import (
    CandidateSerializer,
    QuestionPublicSerializer,
    SubmitExamSerializer
)
try:
    from .models import Candidate, ExamSubmission, SubmissionAnswer
except Exception:
    Candidate, ExamSubmission, SubmissionAnswer = None, None, None


class ExamConfigView(APIView):
    """
    Returns general examination guidelines, terms and conditions.
    """
    def get(self, request):
        return Response({
            "status": "success",
            "data": EXAM_CONFIG
        }, status=status.HTTP_200_OK)


class CandidateValidateView(APIView):
    """
    Validates candidate details (Name, Email).
    """
    def post(self, request):
        serializer = CandidateSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            # Try to store or create candidate if database tables exist
            try:
                if Candidate:
                    Candidate.objects.create(
                        name=data['name'],
                        email=data['email']
                    )
            except Exception:
                # Non-blocking if database is not migrated yet
                pass

            return Response({
                "status": "success",
                "message": "Candidate details verified successfully.",
                "candidate": data
            }, status=status.HTTP_200_OK)
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class QuestionListView(APIView):
    """
    Returns the list of 40 exam questions without revealing correct answers.
    """
    def get(self, request):
        # Strip out 'correct_answer' before sending to client
        public_questions = []
        for q in QUESTIONS:
            public_questions.append({
                "id": q["id"],
                "section": q["section"],
                "passage": q.get("passage"),
                "text": q["text"],
                "options": q["options"]
            })

        serializer = QuestionPublicSerializer(public_questions, many=True)
        return Response({
            "status": "success",
            "total": len(public_questions),
            "duration_minutes": EXAM_CONFIG["duration_minutes"],
            "questions": serializer.data
        }, status=status.HTTP_200_OK)


class ExamSubmitView(APIView):
    """
    Receives candidate answers, computes score, breakdown by section,
    and returns a comprehensive evaluation report.
    """
    def post(self, request):
        serializer = SubmitExamSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "status": "error",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        candidate_data = data["candidate"]
        user_answers = data["answers"]  # Dict: {"1": "C", "2": "A", ...}
        time_spent_seconds = data.get("time_spent_seconds", 0)

        # Build lookup map for questions
        q_map = {str(q["id"]): q for q in QUESTIONS}

        total_questions = len(QUESTIONS)
        correct_count = 0
        wrong_count = 0
        unanswered_count = 0
        detailed_review = []
        section_breakdown = {}

        for q in QUESTIONS:
            qid_str = str(q["id"])
            sec = q["section"]
            if sec not in section_breakdown:
                section_breakdown[sec] = {
                    "total": 0,
                    "correct": 0,
                    "wrong": 0,
                    "unanswered": 0
                }
            section_breakdown[sec]["total"] += 1

            selected = user_answers.get(qid_str)
            if selected is not None:
                selected = str(selected).strip().upper()
                if not selected:
                    selected = None

            is_correct = False
            status_text = "unanswered"

            if selected is None:
                unanswered_count += 1
                section_breakdown[sec]["unanswered"] += 1
            elif selected == q["correct_answer"]:
                correct_count += 1
                is_correct = True
                status_text = "correct"
                section_breakdown[sec]["correct"] += 1
            else:
                wrong_count += 1
                status_text = "incorrect"
                section_breakdown[sec]["wrong"] += 1

            detailed_review.append({
                "question_id": q["id"],
                "section": q["section"],
                "passage": q.get("passage"),
                "text": q["text"],
                "options": q["options"],
                "selected_option": selected,
                "correct_option": q["correct_answer"],
                "is_correct": is_correct,
                "status": status_text
            })

        percentage = round((correct_count / total_questions) * 100, 2)
        passed = percentage >= 50.0  # standard passing benchmark

        # Format time spent
        minutes_spent = time_spent_seconds // 60
        seconds_spent = time_spent_seconds % 60
        time_display = f"{minutes_spent}m {seconds_spent}s"

        result_payload = {
            "candidate": candidate_data,
            "submission_summary": {
                "total_questions": total_questions,
                "answered_questions": correct_count + wrong_count,
                "correct_answers": correct_count,
                "wrong_answers": wrong_count,
                "unanswered_questions": unanswered_count,
                "score": correct_count,
                "max_score": total_questions,
                "percentage": percentage,
                "status": "PASS" if passed else "NEEDS IMPROVEMENT",
                "time_spent_seconds": time_spent_seconds,
                "time_display": time_display,
            },
            "section_breakdown": section_breakdown,
            "detailed_review": detailed_review
        }

        # Optional persistence if database models are active
        try:
            if Candidate and ExamSubmission and SubmissionAnswer:
                cand_obj, _ = Candidate.objects.get_or_create(
                    email=candidate_data['email'],
                    defaults={'name': candidate_data['name']}
                )
                sub_obj = ExamSubmission.objects.create(
                    candidate=cand_obj,
                    total_questions=total_questions,
                    score=correct_count,
                    percentage=percentage,
                    time_spent_seconds=time_spent_seconds
                )
                for rev in detailed_review:
                    SubmissionAnswer.objects.create(
                        submission=sub_obj,
                        question_number=rev['question_id'],
                        selected_option=rev['selected_option'] or "",
                        correct_option=rev['correct_option'],
                        is_correct=rev['is_correct']
                    )
        except Exception:
            # Fallback without failing the response
            pass

        return Response({
            "status": "success",
            "message": "Examination submitted and graded successfully.",
            "data": result_payload
        }, status=status.HTTP_200_OK)
