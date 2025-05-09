from django.urls import path
from .views import create_draw, get_assignment

urlpatterns = [
    path('create-draw/', create_draw, name='create_draw'),
    path('get-assignment/', get_assignment, name='get_assignment'),
]
