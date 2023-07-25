from django.urls import path

from .views import PostListView, PostDetailView, PostCreateView, PostEditView

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('<uuid:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('new/', PostCreateView.as_view(), name='post_new'),
    path('<uuid:pk>/edit/', PostEditView.as_view(), name='post_edit'),
]
