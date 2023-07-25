import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse


def upload_to(instance, filename):
    """Generate file path for profile picture."""
    return 'profile_pictures/{}.{}'.format(uuid.uuid4(), filename.split('.')[-1])


# Define a custom user model with a UUID primary key and additional profile picture and bio fields.
class CustomUser(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    profile_picture = models.ImageField(upload_to=upload_to, null=True, blank=True)
    bio = models.TextField(blank=True)

    def get_absolute_url(self):
        """Get URL for user's detail view."""
        return reverse('profile_detail', kwargs={'pk': self.pk})

    def get_profile_picture_url(self):
        """Get URL for user's profile picture."""
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
