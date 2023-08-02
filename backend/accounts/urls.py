from django.urls import path
from rest_framework.routers import DefaultRouter

from .apis import UserProfileViewSet
from .views import (
    UserProfileListView, 
    UserProfileDetailView, 
    UserProfileEditView,
    UserProfileFollowView
)


router = DefaultRouter()
router.register(r'api', UserProfileViewSet)

urlpatterns = [
    path('profile/', UserProfileListView.as_view(), name='profile_list'),
    path('profile/<uuid:pk>/', UserProfileDetailView.as_view(), name='profile_detail'),
    path('profile/<uuid:pk>/edit/', UserProfileEditView.as_view(), name='profile_edit'),
    path('profile/<uuid:pk>/follow/', UserProfileFollowView.as_view(), name='profile_follow'),
] + router.urls
