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
