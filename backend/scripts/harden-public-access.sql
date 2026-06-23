begin;

delete from directus_permissions
where policy = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'
  and collection in ('Products', 'directus_files')
  and action = 'read';

commit;
