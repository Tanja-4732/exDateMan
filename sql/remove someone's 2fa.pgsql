update "edm_dev"."user"
set "tfaSecret" = null
where "edm_dev"."user"."email" = 'someone@example.com';
