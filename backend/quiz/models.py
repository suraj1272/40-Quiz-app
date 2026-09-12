from django.db import models


class Candidate(models.Model):
    """
    Candidate model storing test taker details.
    Prepared for future database integration.
    """
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Question(models.Model):
    """
    Question model for quiz questions.
    """
    question_number = models.PositiveIntegerField(unique=True)
    section = models.CharField(max_length=100)
    passage = models.TextField(blank=True, null=True)
    text = models.TextField()
    correct_answer = models.CharField(max_length=5)

    class Meta:
        ordering = ['question_number']

    def __str__(self):
        return f"Q{self.question_number}: {self.text[:50]}"


class Option(models.Model):
    """
    Multiple choice options for each question.
    """
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    key = models.CharField(max_length=5)  # A, B, C, D
    text = models.CharField(max_length=500)

    class Meta:
        ordering = ['key']

    def __str__(self):
        return f"{self.key}: {self.text}"


class ExamSubmission(models.Model):
    """
    Stores exam submission metadata and candidate performance.
    """
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)
    total_questions = models.PositiveIntegerField(default=40)
    score = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    time_spent_seconds = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Submission by {self.candidate.name} - Score: {self.score}/{self.total_questions}"


class SubmissionAnswer(models.Model):
    """
    Individual answers chosen by the candidate.
    """
    submission = models.ForeignKey(ExamSubmission, related_name='answers', on_delete=models.CASCADE)
    question_number = models.PositiveIntegerField()
    selected_option = models.CharField(max_length=5, blank=True, null=True)
    correct_option = models.CharField(max_length=5)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Q{self.question_number}: Selected {self.selected_option} (Correct: {self.correct_option})"
