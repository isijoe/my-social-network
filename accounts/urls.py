from django.urls import path

from .views import UserProfileListView, UserProfileDetailView, UserProfileEditView

urlpatterns = [
    path('profile/', UserProfileListView.as_view(), name='profile_list'),
    path('profile/<uuid:pk>/', UserProfileDetailView.as_view(), name='profile_detail'),
    path('profile/<uuid:pk>/edit/', UserProfileEditView.as_view(), name='profile_edit'),
]
