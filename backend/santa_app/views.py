from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
import json
import random
import uuid
from .models import Draw, Participant

@csrf_exempt
@require_POST
def create_draw(request):
    """
    API endpoint to create a Secret Santa draw.
    Expects JSON payload: { "names": ["Alice", "Bob", "Charlie"] }
    """
    try:
        data = json.loads(request.body)
        names = data.get('names', [])

        if len(names) < 2:
            return JsonResponse({"error": "At least two participants are required."}, status=400)

        # Create the draw
        draw = Draw.objects.create()

        # Create participants
        participants = [Participant.objects.create(draw=draw, name=name) for name in names]

        # Create a shuffled assignment ensuring no one gets themselves
        max_attempts = 100
        for attempt in range(max_attempts):
            shuffled = participants.copy()
            random.shuffle(shuffled)

            if all(giver != receiver for giver, receiver in zip(participants, shuffled)):
                break  # Valid assignment found
        else:
            return JsonResponse({"error": "Could not generate a valid assignment after multiple attempts."}, status=500)

        # Save assignments
        for giver, receiver in zip(participants, shuffled):
            giver.assigned_to = receiver
            giver.save()

        # Prepare response
        assignments = [{ "name": p.name, "assigned_to": p.assigned_to.name } for p in participants]

        return JsonResponse({
            "code": str(draw.code),
            "assignments": assignments
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)



@csrf_exempt
@require_GET
def get_assignment(request):
    """
    API endpoint to retrieve who a participant was assigned to.
    Expects GET parameters: ?code=<uuid>&name=<participant_name>
    """
    code = request.GET.get('code')
    name = request.GET.get('name')

    if not code or not name:
        return JsonResponse({"error": "Missing 'code' or 'name' parameter."}, status=400)

    try:
        draw_uuid = uuid.UUID(code)
    except ValueError:
        return JsonResponse({"error": "Invalid code format."}, status=400)

    try:
        draw = Draw.objects.get(code=draw_uuid)
    except Draw.DoesNotExist:
        return JsonResponse({"error": "Draw not found."}, status=404)

    try:
        participant = Participant.objects.get(draw=draw, name=name)
    except Participant.DoesNotExist:
        return JsonResponse({"error": "Participant not found in this draw."}, status=404)

    if participant.assigned_to:
        return JsonResponse({
            "name": participant.name,
            "assigned_to": participant.assigned_to.name
        })
    else:
        return JsonResponse({"error": "Assignment not found."}, status=404)
    
    
    