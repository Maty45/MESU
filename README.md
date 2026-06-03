## Tecnologias
* Backend: Java 26
* Frontend: ReactTS 

## Conexion a BD (application.properties):
1. La base de datos se tiene que llamar `mesu` **obligatoriamente**
```
spring.application.name=backend
spring.datasource.url=jdbc:mysql://localhost:3306/mesu?useSSL=false&serverTimezone=UTC
spring.datasource.username=root  // CAMBIAR POR TU USER
spring.datasource.password=root  // CAMBIAR POR TU PASS
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```
## Orden para pushear algo
1. Te pones en tu rama de cambios con `git checkout rama`
2. te traes los cambios remotos de la rama con `git merge origin/rama`, **resolves conflictos si los hay**
4. te traes la main actualizada con `git merge origin/main`
5. Si todo funciona correcto y no rompiste lo de alguien más, lo pasas a la developer cambiandote a la rama con `git checkout developer`
6. Actualiza la developer con `git merge origin/developer`
7. Si funciona todo pusheas tus cambios y subis a remoto con `git push`

## A tener en cuenta para instalar dependencias en el front:
Para instalar algo en el front, movete primero a la carpeta `mesu-front` y recien ahi instalalo con **pnpm**, no con npm
