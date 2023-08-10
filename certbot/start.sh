#!/bin/sh

# Create staging certificate
# certbot certonly --webroot -w /var/www/certbot -d xyz --email xyz --agree-tos --no-eff-email --keep-until-expiring --staging 
# Create production certificate
# certbot certonly --webroot -w /var/www/certbot -d xyz --email xyz --agree-tos --no-eff-email --keep-until-expiring --force-renewal
# Run until expiring
certbot certonly --webroot -w /var/www/certbot -d xyz --email xyz --agree-tos --no-eff-email --keep-until-expiring

# Start renewal process
# trap exit TERM; while ;: do certbot renew; sleep 12h & wait $${!}; done
while :; do
  certbot renew
  sleep 12h
done
