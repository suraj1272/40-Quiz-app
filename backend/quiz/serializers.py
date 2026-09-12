from rest_framework import serializers


class CandidateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200, min_length=2, required=True, error_messages={
        'required': 'Please enter your full name.',
        'blank': 'Name cannot be empty.'
    })
    email = serializers.EmailField(required=True, error_messages={
        'required': 'Please enter your email address.',
        'invalid': 'Please provide a valid email address.'
    })


class OptionSerializer(serializers.Serializer):
    key = serializers.CharField()
    text = serializers.CharField()


class QuestionPublicSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    section = serializers.CharField()
    passage = serializers.CharField(allow_null=True, required=False)
    text = serializers.CharField()
    options = OptionSerializer(many=True)


class AnswerItemSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_option = serializers.CharField(max_length=5, allow_blank=True, allow_null=True)


class SubmitExamSerializer(serializers.Serializer):
    candidate = CandidateSerializer()
    answers = serializers.DictField(child=serializers.CharField(allow_blank=True, allow_null=True))
    time_spent_seconds = serializers.IntegerField(default=0)
