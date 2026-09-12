from django.contrib import admin
from .models import Candidate, Question, Option, ExamSubmission, SubmissionAnswer


class OptionInline(admin.TabularInline):
    model = Option
    extra = 0


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_number', 'section', 'text_preview', 'correct_answer')
    list_filter = ('section',)
    search_fields = ('text', 'passage')
    inlines = [OptionInline]

    def text_preview(self, obj):
        return obj.text[:60] + "..." if len(obj.text) > 60 else obj.text


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')


class SubmissionAnswerInline(admin.TabularInline):
    model = SubmissionAnswer
    extra = 0
    readonly_fields = ('question_number', 'selected_option', 'correct_option', 'is_correct')


@admin.register(ExamSubmission)
class ExamSubmissionAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'score', 'total_questions', 'percentage', 'submitted_at')
    list_filter = ('submitted_at',)
    inlines = [SubmissionAnswerInline]
