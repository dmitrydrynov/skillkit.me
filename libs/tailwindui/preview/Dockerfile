FROM nginx:alpine

RUN rm -v /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/
COPY public_html /usr/share/nginx/html/
COPY public_html /var/www/html/

CMD ["nginx","-g","daemon off;"]