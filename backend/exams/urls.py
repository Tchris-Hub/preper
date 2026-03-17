from django.urls import path
from .views import QuestionsProxy, SubmitExamView, ExamHistoryView, ExamAnalyticsView, TTSProxyView, ExamAttemptDetailView

urlpatterns = [
    path('questions/', QuestionsProxy.as_view(), name='questions'),
    path('submit/', SubmitExamView.as_view(), name='submit'),
    path('history/', ExamHistoryView.as_view(), name='history'),
    path('history/<int:pk>/', ExamAttemptDetailView.as_view(), name='attempt-detail'),
    path('analytics/', ExamAnalyticsView.as_view(), name='analytics'),
    path('tts/', TTSProxyView.as_view(), name='tts'),
]
