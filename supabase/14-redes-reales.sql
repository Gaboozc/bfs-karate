-- ============================================================================
-- BFS Martial Arts — Las cuentas reales de la academia
--
-- Ejecutar DESPUES de 13-fotos-de-productos.sql
-- Supabase > SQL Editor > New query > pegar TODO > Run
--
-- Tambien se pueden pegar a mano en Panel > Multimedia. Esto solo evita el
-- tecleo y deja constancia de que la de Facebook estaba mal: apuntaba a
-- facebook.com/bfsmartialarts, que no es la pagina de la academia.
--
-- SOBRE LA PLAYLIST
-- No es una lista armada a mano, sino la lista de SUBIDAS del canal: cada
-- video nuevo aparece solo, sin que nadie tenga que agregarlo. Se obtiene
-- cambiando el "UC" del ID del canal por "UU".
--   canal    UC9kk0nifIh00-8dMWvcpM6Q
--   subidas  UU9kk0nifIh00-8dMWvcpM6Q
-- ============================================================================

insert into ajustes (clave, valor) values
  ('red_instagram',    'https://www.instagram.com/bfs_martialarts/'),
  ('red_facebook',     'https://www.facebook.com/p/BFS-Martial-Arts-High-Performance-100083110551806/'),
  ('red_youtube',      'https://www.youtube.com/@BFSMARTIALARTSHIGHPERFORMANCE'),
  ('red_tiktok',       'https://www.tiktok.com/@bfs.martial.arts'),
  ('youtube_playlist', 'UU9kk0nifIh00-8dMWvcpM6Q')
on conflict (clave) do update
  set valor = excluded.valor, actualizado_en = now();


-- ============================================================================
-- COMPROBACION
-- ============================================================================
select clave, valor from ajustes order by clave;
