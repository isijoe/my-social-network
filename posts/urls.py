from django.urls import path

from .views import (PostListView, 
                    PostDetailView, 
                    PostCreateView, 
                    PostEditView, 
                    PostDeleteView,
                    PostCommentView,
                    PostLikeView)

urlpatterns = [
    path('', PostListView.as_view(), name='post_list'),
    path('<uuid:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('new/', PostCreateView.as_view(), name='post_new'),
    path('<uuid:pk>/edit/', PostEditView.as_view(), name='post_edit'),
    path('<uuid:pk>/delete/', PostDeleteView.as_view(), name='post_delete'),
    path('<uuid:pk>/comment/', PostCommentView.as_view(), name='post_comment'),
    path('<uuid:pk>/like/', PostLikeView.as_view(), name='post_like'),
]
