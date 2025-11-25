from django.db import models


class AuthUsuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contrasenha_hash = models.CharField(max_length=255)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    # 🔹 Alias para que SimpleJWT pueda usar .id
    @property
    def id(self):
        return self.id_usuario

    def __str__(self):
        return self.nombre


class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100)
    tipo = models.CharField(
        max_length=50,
        choices=[
            ('GASTO', 'Gasto'),
            ('INGRESO', 'Ingreso'),
            ('AMBOS', 'Ambos')
        ]
    )

    def __str__(self):
        return self.nombre_categoria


class TipoCambio(models.Model):
    id_moneda = models.AutoField(primary_key=True)
    nombre_moneda = models.CharField(max_length=50)
    tasa_cambio = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre_moneda


class Gasto(models.Model):
    id_gasto = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        AuthUsuario,
        on_delete=models.CASCADE,
        related_name="gastos"
    )
    id_categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True
    )
    id_moneda = models.ForeignKey(
        TipoCambio,
        on_delete=models.SET_NULL,
        null=True
    )
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.descripcion or 'Gasto'} - {self.monto}"


class Ingreso(models.Model):
    id_ingreso = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        AuthUsuario,
        on_delete=models.CASCADE,
        related_name="ingresos"
    )
    id_categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True
    )
    id_moneda = models.ForeignKey(
        TipoCambio,
        on_delete=models.SET_NULL,
        null=True
    )
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.descripcion or 'Ingreso'} - {self.monto}"


class Suscripcion(models.Model):
    id_suscripcion = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        AuthUsuario,
        on_delete=models.CASCADE,
        related_name="suscripciones"
    )
    nombre_servicio = models.CharField(max_length=100)
    monto_mensual = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_inicio = models.DateField()
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_servicio
