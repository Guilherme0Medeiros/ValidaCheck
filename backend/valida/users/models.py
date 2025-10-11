from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Aluno'),
        ('secretary', 'Secretário(a)'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.role})"