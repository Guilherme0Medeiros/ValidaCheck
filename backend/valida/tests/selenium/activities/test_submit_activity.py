import sys
import os
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..', '..'))
sys.path.insert(0, project_root)

import django
from django.conf import settings

if not settings.configured:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'valida.settings')
    django.setup()

from users.models import User
from activities.models import Categoria, Atividade

class FullFlowActivityTest(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.create_test_data()
        cls.create_dummy_file()

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.dummy_file_path):
            try:
                os.remove(cls.dummy_file_path)
            except:
                pass
        super().tearDownClass()

    @classmethod
    def create_dummy_file(cls):
        cls.dummy_file_path = os.path.join(project_root, 'comprovante_teste.pdf')
        with open(cls.dummy_file_path, 'w') as f:
            f.write("Conteúdo simulado de um PDF para o teste do ValidaCheck.")

    @classmethod
    def create_test_data(cls):
        email_teste = 'joao@gmail.com'
        cls.senha_teste = 'SenhaSegura123'
        user, created = User.objects.get_or_create(
            email=email_teste,
            defaults={
                'username': 'aluno_joao', 
                'role': 'student',
                'is_verified': True,
                'is_active': True
            }
        )
        user.set_password(cls.senha_teste)
        user.save()
        cls.user = user

        Categoria.objects.get_or_create(nome="Ensino", defaults={'limite_horas': 100})
        Categoria.objects.get_or_create(nome="Pesquisa", defaults={'limite_horas': 100})
        Categoria.objects.get_or_create(nome="Extensão", defaults={'limite_horas': 100})

    def test_login_and_submit_activity_slow(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        driver = webdriver.Chrome(options=options)
        driver.maximize_window() 
        
        driver.implicitly_wait(10)

        try:
            # LOGIN
            print(">>> 1. Abrindo página de Login...")
            driver.get('http://localhost:3000/login')
            time.sleep(2) 

            print("   -> Preenchendo credenciais...")
            driver.find_element(By.ID, 'email').send_keys(self.user.email)
            time.sleep(1) 

            driver.find_element(By.ID, 'password').send_keys(self.senha_teste)
            time.sleep(1) 
            
            print("   -> Clicando em Entrar...")
            driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
            
            # Esperar redirecionar
            WebDriverWait(driver, 10).until(EC.url_contains('/estudante'))
            print(">>> Login realizado! Visualizando Dashboard...")
            time.sleep(3) 

            # IR PARA SOLICITAÇÃO
            print(">>> 2. Navegando para Solicitar Atividade...")
            driver.get('http://localhost:3000/solicitar-atividade')
            time.sleep(2) 

            # PREENCHER FORMULÁRIO
            print(">>> 3. Preenchendo formulário...")
            
            # Categoria
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, 'categoria')))
            select = Select(driver.find_element(By.ID, 'categoria'))
            select.select_by_index(1) 
            time.sleep(1.5) 

            # Título e Local
            driver.find_element(By.ID, 'titulo').send_keys('Monitoria de QA')
            time.sleep(1)
            driver.find_element(By.ID, 'local').send_keys('Sala H10')
            time.sleep(1)
            
            # Datas
            driver.find_element(By.ID, 'dataInicio').send_keys('01112025')
            time.sleep(0.5)
            driver.find_element(By.ID, 'dataTermino').send_keys('30112025')
            time.sleep(1)
            
            # Horas e Vínculo
            driver.find_element(By.ID, 'horasSolicitadas').send_keys('50')
            time.sleep(0.5)
            driver.find_element(By.ID, 'vinculo').send_keys('Projeto de Extensão')
            time.sleep(1)

            # Textareas
            driver.find_element(By.ID, 'descricao').send_keys('Verificando qualidade do teste...')
            time.sleep(1)
            driver.find_element(By.ID, 'observacoes').send_keys('Sem observações.')
            time.sleep(1.5)

            # UPLOAD
            print(">>> 4. Anexando arquivo...")
            upload_input = driver.find_element(By.ID, 'uploads')
            upload_input.send_keys(self.dummy_file_path)
            time.sleep(2) 

            # ENVIAR
            print(">>> 5. Enviando...")
            submit_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Enviar nova atividade')]")
            driver.execute_script("arguments[0].click();", submit_btn)

            # VALIDAÇÃO
            print(">>> 6. Aguardando confirmação...")
            time.sleep(2) 
            
            WebDriverWait(driver, 15).until(
                EC.text_to_be_present_in_element(
                    (By.XPATH, "//div[contains(text(), 'Atividade enviada com sucesso')]"),
                    "Atividade enviada com sucesso"
                )
            )
            print("   -> Mensagem de sucesso visualizada!")
            
            time.sleep(3)

            # Verificação final no banco
            # CORREÇÃO 2: Atualizado o título buscado para bater com o preenchido acima ('Monitoria de QA')
            atividade = Atividade.objects.filter(
                titulo='Monitoria de QA', 
                enviado_por=self.user
            ).last()
            
            self.assertIsNotNone(atividade, "Atividade não encontrada no banco de dados!")
            print(f"   -> Teste Finalizado com Sucesso! Atividade ID: {atividade.id}")

        except Exception as e:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            driver.save_screenshot(f'erro_slow_{timestamp}.png')
            print(f"ERRO: Screenshot salvo.")
            raise e
            
        finally:
            driver.quit()

if __name__ == '__main__':
    unittest.main()