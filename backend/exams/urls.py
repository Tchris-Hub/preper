from django.urls import path
from .views import QuestionsProxy, SubmitExamView, ExamHistoryView, ExamAnalyticsView

urlpatterns = [
    path('questions/', QuestionsProxy.as_view(), name='questions'),
    path('submit/', SubmitExamView.as_view(), name='submit'),
    path('history/', ExamHistoryView.as_view(), name='history'),
    path('analytics/', ExamAnalyticsView.as_view(), name='analytics'),
]
