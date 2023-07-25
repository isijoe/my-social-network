import uuid
from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse


def upload_to(instance, filename):
    return 'post_images/{}.{}'.format(uuid.uuid4(), filename.split('.')[-1])


# Define a Post model with a UUID primary key and additional image and caption fields.
class Post(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_to)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_absolute_url(self):
        """Get URL for post's detail view."""
        return reverse('post_detail', kwargs={'pk': self.pk})

    def get_edit_url(self):
        """Get URL for post's edit view."""
        return reverse('post_edit', kwargs={'pk': self.pk})

    def get_image_url(self):
        """Get URL for post's image."""
        if self.image and hasattr(self.image, 'url'):
            return self.image.url


# Define a Comment model with a UUID primary key and additional user, post, and text fields.
class Comment(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


# Define a Like model with a UUID primary key and additional user and post fields.
class Like(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

