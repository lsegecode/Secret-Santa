from django.db import models
import uuid

class Draw(models.Model):
    """Represents a raffle (a round of Secret Santa) """
    code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sorteo {self.code}"


class Participant(models.Model):
    """Represents a participant in a draw """
    draw = models.ForeignKey(Draw, on_delete=models.CASCADE, related_name='participants')
    name = models.CharField(max_length=100)
    assigned_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name


