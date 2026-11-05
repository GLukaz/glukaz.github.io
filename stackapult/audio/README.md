# Audio de Stackapult

Los archivos de esta carpeta **se generan**: no los edites a mano.

```bash
python tools/import_audio.py
```

El script lee la receta `tools/audio-map.json` y las fuentes de `audio-src/`:

- `audio-src/kenney/`: packs CC0 de Kenney.nl.
- `audio-src/music/`: música CC0 de OpenGameArt. Los `.wav` no se suben a git; descárgalos de las URLs de `CREDITS.md`.
- `audio-src/synth/`: los sonidos procedurales antiguos de `tools/gen_audio.py`.

Para cada sonido el script:

1. Mezcla sus capas.
2. Recorta los silencios.
3. Iguala la sonoridad por grupo (`ui`, `impact`, `big`, `voice`, `jingle`, `music`).
4. Limita los picos a −1 dBFS.
5. Escribe:
   - `sfx/<clave>.ogg` si el sonido tiene una variante;
   - `sfx/<clave>_1.ogg … _N.ogg` si tiene varias (el juego elige una al azar, sin repetir la anterior);
   - `music/<pista>.ogg`;
   - `manifest.json`, la lista de archivos que lee `src/audio.ts`.

## Cambiar o añadir un sonido

- **Cambiar un sonido:** edita su receta en `tools/audio-map.json` y vuelve a ejecutar el script.
- **Añadir un sonido nuevo:**
  1. Añade su clave a `SFX` en `src/audio.ts`.
  2. Añade su receta en `tools/audio-map.json`.
  3. Llama a `audio.sfx('<clave>')` desde el código.

## Mezcla

Volúmenes por clave, anti-spam (throttle) y voces: bloque `AUDIO` en `src/tuning.ts`.

## Licencias

Todo el audio de terceros es CC0. El detalle está en `CREDITS.md`.

## Cuándo suena cada sonido

| Clave | Cuándo suena |
|---|---|
| `click`, `star`, `coin`, `upgrade` | Interfaz: botones, estrellas del resultado, contador de oro, mejora del taller |
| `slabDrop`, `slabPerfect`, `slabMiss`, `merge` | Apilado |
| `catapultFire`, `crateHit`, `crateBurst` | Disparo de la catapulta, impacto de la piedra, la piedra se deshace |
| `hitStone`, `hitWood`, `hitGlass`, `hitMetal` (`blockHit` de respaldo) | Golpes entre piezas, según el material |
| `breakStone`, `breakWood`, `breakGlass`, `breakMetal` (`blockBreak` de respaldo) | Rotura de piezas, según el material |
| `kingDie`, `soldierDie` | Cae el rey, cae un soldado |
| `splash` | Una pieza cae al foso o al agua |
| `tntFuse`, `tntExplode` | TNT |
| `ballistaFire`, `ballistaBreak`, `boltHit`, `boltMiss`, `boltSplash` | Ballestas enemigas |
| `guardHit`, `shieldBreak`, `catapultHit`, `pileHit` | Contraataque enemigo |
| `win`, `lose` | Castillo conquistado (al caer, no en la tarjeta) / derrota |
