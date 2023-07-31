import os
import uuid
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist


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
    # image = models.ImageField(upload_to=upload_to)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_absolute_url(self):
        """Get URL for post's detail view."""
        return reverse('post_detail', kwargs={'pk': self.pk})

    def get_edit_url(self):
        """Get URL for post's edit view."""
        return reverse('post_edit', kwargs={'pk': self.pk})

    def delete(self, *args, **kwargs):
        """Delete post object and remove all images from filesystem."""
        for image in self.post_imgs.all():
            if os.path.isfile(image.image.path):
                os.remove(os.path.join(settings.MEDIA_ROOT, image.image.path))
            image.delete()
        super().delete(*args, **kwargs)

    # TODO: not working properly, maybe method is called before changed post instance is saved in database 
    def save(self, *args, **kwargs):
        try:
            # Try to get the old object from the database
            old_post = Post.objects.get(pk=self.pk)

            # Get the old images related to the old post
            old_images = old_post.post_imgs.all()

            # Get the current images related to the current post instance
            current_images = self.post_imgs.all()

            # Find the images that have been removed by comparing old images and current images
            removed_images = old_images.exclude(id__in=current_images.values_list('id'))

            # Delete the removed images
            for image in removed_images:
                if os.path.isfile(image.image.path):
                    os.remove(os.path.join(settings.MEDIA_ROOT, image.image.path))
                image.delete()
        except ObjectDoesNotExist:
            pass

        super().save(*args, **kwargs)


# Define a PostImage model with a UUID primary key and additional post field.
class PostImage(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    post = models.ForeignKey(Post, related_name='post_imgs', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_to)

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
