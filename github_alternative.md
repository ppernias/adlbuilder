# Alternativas para subir el repositorio a GitHub

Debido a las limitaciones del entorno actual, hay varias opciones para subir el repositorio a GitHub:

## Opción 1: Usar un token de acceso personal en la URL

1. Crea un token de acceso personal (PAT) en GitHub:
   - Ve a https://github.com/settings/tokens
   - Haz clic en "Generate new token (classic)"
   - Dale un nombre descriptivo como "ADL Builder"
   - Selecciona los permisos "repo" (acceso completo a repositorios)
   - Haz clic en "Generate token"
   - **Copia el token generado** - ¡es muy importante que lo guardes ahora!

2. Configura el remoto con el token incluido en la URL:
   ```bash
   git remote add origin https://TU_TOKEN@github.com/ppernias/adlbuilder.git
   ```

3. Sube los cambios:
   ```bash
   git push -u origin master
   ```

## Opción 2: Exportar el repositorio como ZIP y subirlo manualmente

Si la autenticación sigue siendo problemática, puedes exportar el código y subirlo manualmente:

1. Crea un archivo ZIP del proyecto:
   ```bash
   cd /root
   zip -r adlbuilder.zip adlbuilder
   ```

2. Descarga el archivo ZIP a tu máquina local

3. En GitHub, después de crear el repositorio:
   - Haz clic en "uploading an existing file"
   - Arrastra y suelta el archivo ZIP descomprimido
   - Confirma los cambios

## Opción 3: Usar GitHub CLI (si está disponible)

Si GitHub CLI está instalado o puede instalarse:

1. Instalar GitHub CLI:
   ```bash
   apt install gh
   ```

2. Autenticarse:
   ```bash
   gh auth login
   ```

3. Crear y subir el repositorio:
   ```bash
   gh repo create ppernias/adlbuilder --public --source=. --push
   ```

## Opción 4: Clonar el repositorio en tu máquina local

Si tienes acceso a una máquina local con Git:

1. Crea el repositorio en GitHub desde el navegador
2. Clona el repositorio vacío en tu máquina local
3. Copia los archivos del proyecto a tu máquina local
4. Haz commit y push desde tu máquina local donde la autenticación es más sencilla
