from django.urls import path
from .views import (
    ExamConfigView,
    CandidateValidateView,
    QuestionListView,
    ExamSubmitView
)

urlpatterns = [
    path('config/', ExamConfigView.as_view(), name='exam-config'),
    path('candidate/validate/', CandidateValidateView.as_view(), name='candidate-validate'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('submit/', ExamSubmitView.as_view(), name='exam-submit'),
]
