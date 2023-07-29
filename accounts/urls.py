from django.urls import path

from .apis import UserProfileList, UserProfileDetail
from .views import (
    UserProfileListView, 
    UserProfileDetailView, 
    UserProfileEditView,
    UserProfileFollowView
)

urlpatterns = [
    path('profile/', UserProfileListView.as_view(), name='profile_list'),
    path('profile/<uuid:pk>/', UserProfileDetailView.as_view(), name='profile_detail'),
    path('profile/<uuid:pk>/edit/', UserProfileEditView.as_view(), name='profile_edit'),
    path('profile/<uuid:pk>/follow/', UserProfileFollowView.as_view(), name='profile_follow'),

    # APIViews
    path('api/', UserProfileList.as_view(), name='api_profile_list'),
    path('api/<uuid:pk>/', UserProfileDetail.as_view(), name='api_profile_detail'),
]
