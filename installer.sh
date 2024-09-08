#!/bin/bash

# Function to update or create an .env file
update_or_create_env_file() {
  local env_file=$1
  local key=$2
  local value=$3

  # Escape special characters in value for sed
  escaped_value=$(echo "$value" | sed -e 's/[\/&]/\\&/g')

  # Update the key if it exists, otherwise append the key-value pair
  if grep -q "^${key}=" "${env_file}"; then
    sed -i "s/^${key}=.*/${key}=${escaped_value}/" "${env_file}"
  else
    echo "${key}=${value}" >> "${env_file}"
  fi
}

read_from_env() {
  local env_file=$1
  local key=$2
  grep "^${key}=" "${env_file}" | cut -d '=' -f2
}

# Function to normalize the domain URL
normalize_url() {
  local url=$1
  if [[ $url =~ ^http:// ]]; then
    url="${url/http:\/\//https:\/\/}"
  elif [[ ! $url =~ ^https?:// ]]; then
    url="https://$url"
  fi
  echo $url
}

# Function to print colored text
print_colored() {
  local color=$1
  local text=$2
  echo -e "\e[${color}m${text}\e[0m"
}

# Function to print yellow text
print_yellow() {
  print_colored "33" "$1"
}

# Function to print red text
print_red() {
  print_colored "31" "$1"
}

# Function to print green text
print_green() {
  print_colored "32" "$1"
}

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]; then
  print_red "This script must be run as root. Exiting."
  exit 1
fi

# Check for minimum RAM requirements
total_ram=$(free -m | awk '/^Mem:/{print $2}')
if [ "$total_ram" -lt 3072 ]; then
  print_red "Insufficient RAM. You need at least 4GB to proceed."
  exit 1
fi

# Ensure .env file exists
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    print_yellow ".env not found. Renaming .env.example to .env."
    mv .env.example .env
  else
    print_red "Neither .env nor .env.example file found. Exiting."
    exit 1
  fi
fi

# NodeJS Installation based on package manager
if command -v apt > /dev/null 2>&1; then
  # For distributions using apt (like Ubuntu, Debian)
  apt-get update && apt-get upgrade -y
  apt-get install -y ca-certificates curl gnupg

  # Add Nodesource repository if not already added
  if ! grep -q "nodesource" /etc/apt/sources.list.d/nodesource.list 2> /dev/null; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
    apt-get update
  fi

  # Install Node.js if necessary
  NODE_VERSION=$(node -v 2> /dev/null)
  REQUIRED_VERSION="v20"
  if [ -z "$NODE_VERSION" ] || [ "${NODE_VERSION:1:2}" -lt "${REQUIRED_VERSION:1:2}" ]; then
    apt-get install -y nodejs
  fi

  # Install Redis
  apt-get install -y redis-server
  systemctl enable redis-server
  systemctl start redis-server

elif command -v dnf > /dev/null 2>&1; then
  # For distributions using dnf (like Fedora, AlmaLinux)
  dnf update -y && dnf install -y curl dnf-plugins-core

  # Install NVM and Node.js
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  nvm install 20

  # Install Redis
  dnf install -y redis
  systemctl enable redis
  systemctl start redis

elif command -v yum > /dev/null 2>&1; then
  # For distributions using yum (like CentOS, RHEL)
  yum install -y https://rpm.nodesource.com/pub_20.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm
  yum install -y nodejs --setopt=nodesource-nodejs.module_hotfixes=1

  # Handle potential Node.js installation issues
  if [ $? -ne 0 ]; then
    print_red "Node.js installation failed. Attempting to remove conflicting npm package..."
    yum remove -y npm
    yum install -y nodejs --setopt=nodesource-nodejs.module_hotfixes=1
    if [ $? -ne 0 ]; then
      print_red "Node.js installation failed again after removing npm. Exiting."
      exit 1
    fi
  fi

  # Install Redis
  yum --enablerepo=epel install -y redis
  systemctl enable redis
  systemctl start redis

else
  print_red "Unsupported package manager. Exiting."
  exit 1
fi

# Install global npm packages if not already installed
is_npm_package_installed() {
  npm list -g --depth=0 | grep -q "$1"
}

npm_packages=("pnpm" "typescript" "ts-node" "pm2")
for package in "${npm_packages[@]}"; do
  if is_npm_package_installed "$package"; then
    print_green "$package is already installed."
  else
    print_yellow "Installing $package..."
    npm install -g "$package"
  fi
done

# Get default MySQL values from .env
default_app_public_url=$(read_from_env ".env" "NEXT_PUBLIC_SITE_URL")
default_app_public_site_name=$(read_from_env ".env" "NEXT_PUBLIC_SITE_NAME")
default_mysql_db_name=$(read_from_env ".env" "DB_NAME")
default_mysql_username=$(read_from_env ".env" "DB_USER")
default_mysql_password=$(read_from_env ".env" "DB_PASSWORD")
default_mysql_host=$(read_from_env ".env" "DB_HOST")
default_mysql_port=$(read_from_env ".env" "DB_PORT")

# Print default MySQL variables
echo -e "\nDebug: Default MySQL Variables:"
echo "--------------------------------"
echo "Database: ${default_mysql_db_name}"
echo "Username: ${default_mysql_username}"
echo "Password: ${default_mysql_password}"
echo "Host:     ${default_mysql_host}"
echo "Port:     ${default_mysql_port}"
echo "--------------------------------"

# Prompt user for site URL and name with default values
read -p "Enter the site URL: " NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_URL=$(normalize_url "${NEXT_PUBLIC_SITE_URL:-$default_app_public_url}")

read -p "Enter the site name: " NEXT_PUBLIC_SITE_NAME
NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME:-$default_app_public_site_name}

# Prompt user for MySQL credentials and test connection
while true; do
  read -p "Enter MySQL database name: " DB_NAME
  DB_NAME=${DB_NAME:-$default_mysql_db_name}

  read -p "Enter MySQL username: " DB_USER
  DB_USER=${DB_USER:-$default_mysql_username}

  # Ensure the password prompt is on the same line as the input
  read -s -p "Enter MySQL password: " DB_PASSWORD
  echo # Move to a new line after password input
  DB_PASSWORD=${DB_PASSWORD:-$default_mysql_password}

  read -p "Enter MySQL host: " DB_HOST
  DB_HOST=${DB_HOST:-${default_mysql_host:-'localhost'}}

  read -p "Enter MySQL port: " DB_PORT
  DB_PORT=${DB_PORT:-${default_mysql_port:-'3306'}}

  # Test MySQL connection
  mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" -e 'exit'
  if [ $? -eq 0 ]; then
    print_green "Successfully connected to MySQL."
    break
  else
    print_red "Failed to connect to MySQL. Please check your database credentials."
  fi
done

# Function to import initial SQL file
import_initial_sql() {
  print_yellow "Importing initial.sql to the database..."
  mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" < initial.sql
  if [ $? -eq 0 ]; then
    print_green "initial.sql imported successfully."
  else
    print_red "Failed to import initial.sql. Please check the file and your database credentials."
    exit 1
  fi
}

# Import the initial SQL file
import_initial_sql

# Generate token secrets
APP_ACCESS_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
APP_REFRESH_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
APP_RESET_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
APP_VERIFY_TOKEN_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Update or create .env file
update_or_create_env_file ".env" "NEXT_PUBLIC_SITE_URL" "${NEXT_PUBLIC_SITE_URL}"
update_or_create_env_file ".env" "NEXT_PUBLIC_SITE_NAME" "${NEXT_PUBLIC_SITE_NAME}"
update_or_create_env_file ".env" "DB_NAME" "${DB_NAME}"
update_or_create_env_file ".env" "DB_USER" "${DB_USER}"
update_or_create_env_file ".env" "DB_PASSWORD" "${DB_PASSWORD}"
update_or_create_env_file ".env" "DB_HOST" "${DB_HOST}"
update_or_create_env_file ".env" "DB_PORT" "${DB_PORT}"
update_or_create_env_file ".env" "APP_ACCESS_TOKEN_SECRET" "${APP_ACCESS_TOKEN_SECRET}"
update_or_create_env_file ".env" "APP_REFRESH_TOKEN_SECRET" "${APP_REFRESH_TOKEN_SECRET}"
update_or_create_env_file ".env" "APP_RESET_TOKEN_SECRET" "${APP_RESET_TOKEN_SECRET}"
update_or_create_env_file ".env" "APP_VERIFY_TOKEN_SECRET" "${APP_VERIFY_TOKEN_SECRET}"

# Ensure pnpm is installed
if ! command -v pnpm > /dev/null 2>&1; then
  print_yellow "pnpm is not installed. Installing pnpm..."
  npm install -g pnpm
  if [ $? -ne 0 ]; then
    print_red "Failed to install pnpm. Exiting."
    exit 1
  else
    print_green "pnpm installed successfully."
  fi
else
  print_green "pnpm is already installed."
fi

# Install dependencies and build project
pnpm install
pnpm build
pnpm build:backend
pnpm seed

# Check and configure Apache or Nginx
apache_check=$(systemctl list-units --type=service | grep -E 'apache2.service|httpd.service')
nginx_check=$(systemctl list-units --type=service | grep nginx.service)

if [ -n "$apache_check" ]; then
  print_green "Apache is installed and running."
  if command -v apt > /dev/null 2>&1; then
    # Configure Apache for Ubuntu/Debian
    add-apt-repository ppa:ondrej/apache2 -y
    apt-get update && apt-get upgrade -y apache2
    systemctl restart apache2

    # Enable necessary Apache modules
    a2enmod proxy proxy_http proxy_http2 proxy_wstunnel ssl rewrite
    systemctl restart apache2
    chown_files=true

  elif command -v dnf > /dev/null 2>&1; then
    # Configure Apache for Fedora/AlmaLinux
    dnf install -y httpd mod_ssl httpd-tools
    systemctl enable --now httpd

    # Add necessary Apache modules
    echo 'LoadModule proxy_module modules/mod_proxy.so' | tee -a /etc/httpd/conf/httpd.conf
    echo 'LoadModule proxy_http_module modules/mod_proxy_http.so' | tee -a /etc/httpd/conf/httpd.conf
    echo 'LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so' | tee -a /etc/httpd/conf/httpd.conf
    echo 'LoadModule ssl_module modules/mod_ssl.so' | tee -a /etc/httpd/conf.d/ssl.conf
    echo 'LoadModule rewrite_module modules/mod_rewrite.so' | tee -a /etc/httpd/conf/httpd.conf
    systemctl restart httpd

  elif command -v yum > /dev/null 2>&1; then
    # Configure Apache for CentOS/RHEL
    yum install -y httpd mod_ssl
    systemctl enable --now httpd

    # Enable necessary Apache modules
    sed -i '/^#LoadModule proxy_module/s/^#//' /etc/httpd/conf.modules.d/00-proxy.conf
    sed -i '/^#LoadModule proxy_http_module/s/^#//' /etc/httpd/conf.modules.d/00-proxy.conf
    sed -i '/^#LoadModule proxy_wstunnel_module/s/^#//' /etc/httpd/conf.modules.d/00-proxy.conf
    sed -i '/^#LoadModule ssl_module/s/^#//' /etc/httpd/conf.modules.d/00-ssl.conf
    sed -i '/^#LoadModule rewrite_module/s/^#//' /etc/httpd/conf.modules.d/00-base.conf
    systemctl restart httpd
    chown_files=true
  fi

else
  print_red "Neither Apache nor Nginx is installed."
  exit 1
fi

print_green "Installation and setup complete."
print_yellow "##################################"
print_green "Super Admin Details:"
print_green "Email: superadmin@example.com"
print_green "Password: 12345678"
print_green "Admin panel: \e[4m${NEXT_PUBLIC_SITE_URL}\e[0m"
print_yellow "##################################"
print_green "To start the server, run: pnpm start"
print_green "To stop the server, run: pnpm stop"
print_yellow "##################################"
