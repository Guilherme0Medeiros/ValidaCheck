from users.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adiciona informações extras dentro do JWT
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Inclui dados extras na resposta da API
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data
    
class UserRegisterSerializer(serializers.ModelSerializer): 
    
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required= True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_staff']
        # força para não incluir relações automaticamente
        extra_kwargs = {
            'goups': {'read_only': True},
            'user_permissions': {'read_only', True}
        }