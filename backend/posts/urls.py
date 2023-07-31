from django.urls import path

from .apis import PostList, PostDetail
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

    # APIViews
    path('api/', PostList.as_view(), name='api_post_list'),
    path('api/<uuid:pk>/', PostDetail.as_view(), name='api_post_detail'),
    # path('api/new/', PostCreate.as_view(), name='api_post_new'),
]