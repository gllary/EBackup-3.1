FROM nginx

LABEL name="qiansy"

ADD docker/nginx.conf /etc/nginx/nginx.conf

COPY dist/ /usr/share/nginx/html/ebackup/
