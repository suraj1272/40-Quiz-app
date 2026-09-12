from django.core.management.base import BaseCommand
from quiz.models import Question, Option
from quiz.questions_data import QUESTIONS


class Command(BaseCommand):
    help = 'Populates the database with the 40 questions from TTS Set D'

    def handle(self, *args, **options):
        self.stdout.write("Populating questions into database...")
        for q_data in QUESTIONS:
            question, created = Question.objects.update_or_create(
                question_number=q_data['id'],
                defaults={
                    'section': q_data['section'],
                    'passage': q_data.get('passage'),
                    'text': q_data['text'],
                    'correct_answer': q_data['correct_answer']
                }
            )
            for opt in q_data['options']:
                Option.objects.update_or_create(
                    question=question,
                    key=opt['key'],
                    defaults={'text': opt['text']}
                )
        self.stdout.write(self.style.SUCCESS(f"Successfully populated {len(QUESTIONS)} questions."))
