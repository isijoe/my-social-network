from django.contrib.auth.models import AbstractUser
from django.db import models
# from django.urls import reverse
import uuid

def upload_to(instance, filename):
    return 'profile_pictures/{}.{}'.format(uuid.uuid4(), filename.split('.')[-1])

# Create your models here.
class CustomUser(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    profile_picture = models.ImageField(upload_to=upload_to, null=True, blank=True)
    bio = models.TextField(blank=True)

    # def get_absolute_url(self):
    #     return reverse('user_detail', kwargs=('pk': self.pk))

    def get_profile_picture_url(self):
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
