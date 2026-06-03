const fs = require('fs');
const path = require('path');

/**
 * Diagrama UML Completo con Patrones de Diseño
 * Incluye: Singletons, Controllers, Routes, Middlewares y Modelos
 */

function generateCompleteUML() {
  let uml = '@startuml\n';
  uml += 'title Nortech Backend - Complete Architecture\n';
  uml += '\n';

  // ==================== INFRASTRUCTURE SINGLETONS ====================
  uml += "' ==================== INFRASTRUCTURE LAYER (SINGLETONS) ====================\n";
  
  // Singleton: DatabasePool
  uml += '<<singleton>> class DatabasePool {\n';
  uml += '  - {static} instance : DatabasePool\n';
  uml += '  - client : pg.Pool\n';
  uml += '  - host : string\n';
  uml += '  - user : string\n';
  uml += '  - password : string\n';
  uml += '  - database : string\n';
  uml += '  - port : int\n';
  uml += '  --\n';
  uml += '  - DatabasePool()\n';
  uml += '  + {static} getInstance() : DatabasePool\n';
  uml += '  + query(sql, values) : Promise<Result>\n';
  uml += '  + connect() : void\n';
  uml += '}\n';
  uml += '\n';

  // Singleton: SupabaseClient
  uml += '<<singleton>> class SupabaseClient {\n';
  uml += '  - {static} instance : SupabaseClient\n';
  uml += '  - client : any\n';
  uml += '  - url : string\n';
  uml += '  - key : string\n';
  uml += '  --\n';
  uml += '  - SupabaseClient()\n';
  uml += '  + {static} getInstance() : SupabaseClient\n';
  uml += '  + auth : SupabaseAuth\n';
  uml += '  + getClient() : any\n';
  uml += '}\n';
  uml += '\n';

  // ==================== MIDDLEWARE LAYER ====================
  uml += "' ==================== MIDDLEWARE LAYER ====================\n";
  
  uml += 'class AuthenticationMiddleware {\n';
  uml += '  --\n';
  uml += '  + authenticate(req, res, next) : void\n';
  uml += '  - verifyToken(token) : Promise<User>\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class AuthorizationMiddleware {\n';
  uml += '  --\n';
  uml += '  + isAdmin(req, res, next) : void\n';
  uml += '  - checkPermissions(user, role) : boolean\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class ErrorHandlerMiddleware {\n';
  uml += '  --\n';
  uml += '  + handle(error, req, res, next) : void\n';
  uml += '  - formatError(error) : ErrorResponse\n';
  uml += '  - logError(error) : void\n';
  uml += '}\n';
  uml += '\n';

  // ==================== CONTROLLER LAYER ====================
  uml += "' ==================== CONTROLLER LAYER ====================\n";
  
  uml += 'class AuthController {\n';
  uml += '  - userModel : User\n';
  uml += '  - supabase : SupabaseClient\n';
  uml += '  --\n';
  uml += '  + signUpNewEmail(req, res, next) : Promise<void>\n';
  uml += '  + signInNewSession(req, res, next) : Promise<void>\n';
  uml += '  + getProfiles(req, res, next) : Promise<void>\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class ProductController {\n';
  uml += '  - productModel : Product\n';
  uml += '  - db : DatabasePool\n';
  uml += '  --\n';
  uml += '  + getProducts(req, res, next) : Promise<void>\n';
  uml += '  + getProduct(req, res, next) : Promise<void>\n';
  uml += '  + createProduct(req, res, next) : Promise<void>\n';
  uml += '  + updateProduct(req, res, next) : Promise<void>\n';
  uml += '  + deleteProduct(req, res, next) : Promise<void>\n';
  uml += '  + reactivateProduct(req, res, next) : Promise<void>\n';
  uml += '  + getActiveProducts(req, res, next) : Promise<void>\n';
  uml += '  + getCategories(req, res, next) : Promise<void>\n';
  uml += '  + getBrands(req, res, next) : Promise<void>\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class SaleController {\n';
  uml += '  - saleModel : Sale\n';
  uml += '  - saleDetailModel : SaleDetail\n';
  uml += '  - productModel : Product\n';
  uml += '  - userModel : User\n';
  uml += '  - db : DatabasePool\n';
  uml += '  --\n';
  uml += '  + createSale(req, res, next) : Promise<void>\n';
  uml += '  + getSaleHistory(req, res, next) : Promise<void>\n';
  uml += '  - calculateTotal(items) : decimal\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class SaleDetailController {\n';
  uml += '  - saleDetailModel : SaleDetail\n';
  uml += '  - db : DatabasePool\n';
  uml += '  --\n';
  uml += '  + createSaleDetail(req, res, next) : Promise<void>\n';
  uml += '}\n';
  uml += '\n';

  // ==================== ROUTE LAYER ====================
  uml += "' ==================== ROUTE LAYER ====================\n";
  
  uml += 'class AuthRoutes {\n';
  uml += '  - router : Express.Router\n';
  uml += '  - controller : AuthController\n';
  uml += '  --\n';
  uml += '  + POST /signup : void\n';
  uml += '  + POST /signin : void\n';
  uml += '  + GET /profiles : void\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class ProductRoutes {\n';
  uml += '  - router : Express.Router\n';
  uml += '  - controller : ProductController\n';
  uml += '  - authMiddleware : AuthenticationMiddleware\n';
  uml += '  --\n';
  uml += '  + GET / : void\n';
  uml += '  + GET /:id : void\n';
  uml += '  + POST / : void\n';
  uml += '  + PUT /:id : void\n';
  uml += '  + DELETE /:id : void\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class SaleRoutes {\n';
  uml += '  - router : Express.Router\n';
  uml += '  - controller : SaleController\n';
  uml += '  - authMiddleware : AuthenticationMiddleware\n';
  uml += '  - adminMiddleware : AuthorizationMiddleware\n';
  uml += '  --\n';
  uml += '  + POST / : void\n';
  uml += '  + GET /history/:userId : void\n';
  uml += '}\n';
  uml += '\n';

  // ==================== DOMAIN LAYER ====================
  uml += "' ==================== DOMAIN LAYER (MODELS) ====================\n";
  
  uml += 'class User {\n';
  uml += '  - id : int\n';
  uml += '  - idperfil : int\n';
  uml += '  - id_auth_supabase : UUID\n';
  uml += '  - nombre : string\n';
  uml += '  - apellido : string\n';
  uml += '  - usuario : string\n';
  uml += '  - email : string\n';
  uml += '  - dni : string\n';
  uml += '  - telefono : string\n';
  uml += '  - fechanacimiento : date\n';
  uml += '  - eliminado : boolean\n';
  uml += '  --\n';
  uml += '  + mostrarRolPorId(idAuthSupabase) : int\n';
  uml += '  + registerInPostgreSQL(userData) : User\n';
  uml += '  + getUsuarioByAuthId(auth_id) : User\n';
  uml += '  + obtenerPerfiles() : Role[]\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class Product {\n';
  uml += '  - id : int\n';
  uml += '  - nombre : string\n';
  uml += '  - imagen : string\n';
  uml += '  - idMarca : int\n';
  uml += '  - descripcion : string\n';
  uml += '  - precio_costo : decimal\n';
  uml += '  - precio_venta : decimal\n';
  uml += '  - stock : int\n';
  uml += '  - stock_min : int\n';
  uml += '  - idCategoria : int\n';
  uml += '  - eliminado : boolean\n';
  uml += '  --\n';
  uml += '  + mostrarProductosTodos() : Product[]\n';
  uml += '  + mostrarProductoPorId(id) : Product\n';
  uml += '  + crearProducto(data) : Product\n';
  uml += '  + editarProducto(id, data) : Product\n';
  uml += '  + eliminarProducto(id) : Product\n';
  uml += '  + obtenerActivos() : Product[]\n';
  uml += '  + obtenerInactivos() : Product[]\n';
  uml += '  + descontarStockProducto(cantidad) : void\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class Sale {\n';
  uml += '  - id : int\n';
  uml += '  - idusuario : int\n';
  uml += '  - total : decimal\n';
  uml += '  - estado : string\n';
  uml += '  - fecha_creacion : timestamp\n';
  uml += '  --\n';
  uml += '  + crearVenta(idusuario, total, estado) : Sale\n';
  uml += '  + obtenerHistorialVentasPorUsuario(idusuario) : Sale[]\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class SaleDetail {\n';
  uml += '  - id : int\n';
  uml += '  - idventa : int\n';
  uml += '  - idproducto : int\n';
  uml += '  - descripcion : string\n';
  uml += '  - precio_venta : decimal\n';
  uml += '  - cantidad : int\n';
  uml += '  - subtotal : decimal\n';
  uml += '  --\n';
  uml += '  + crearDetalleVenta(data) : SaleDetail\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class Brand {\n';
  uml += '  - idMarca : int\n';
  uml += '  - nombre : string\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class Category {\n';
  uml += '  - idcategoria : int\n';
  uml += '  - nombre : string\n';
  uml += '}\n';
  uml += '\n';

  uml += 'class Role {\n';
  uml += '  - idperfil : int\n';
  uml += '  - nombre : string\n';
  uml += '}\n';
  uml += '\n';

  // ==================== RELACIONES ====================
  uml += "' ==================== RELATIONSHIPS ====================\n\n";
  
  uml += "' Singleton Dependencies\n";
  uml += 'DatabasePool --> "1" User : queries\n';
  uml += 'DatabasePool --> "1" Product : queries\n';
  uml += 'DatabasePool --> "1" Sale : queries\n';
  uml += 'SupabaseClient --> "1" User : authenticates\n';
  uml += '\n';

  uml += "' Middleware Dependencies\n";
  uml += 'AuthenticationMiddleware --> "1" User : validates\n';
  uml += 'AuthorizationMiddleware --> "1" User : checks\n';
  uml += '\n';

  uml += "' Controller Dependencies\n";
  uml += 'AuthController --> "1" User : manages\n';
  uml += 'AuthController --> "1" SupabaseClient : uses\n';
  uml += 'ProductController --> "1" Product : manages\n';
  uml += 'ProductController --> "1" DatabasePool : uses\n';
  uml += 'SaleController --> "1" Sale : manages\n';
  uml += 'SaleController --> "1" SaleDetail : manages\n';
  uml += 'SaleController --> "1" Product : uses\n';
  uml += 'SaleController --> "1" User : uses\n';
  uml += 'SaleController --> "1" DatabasePool : uses\n';
  uml += 'SaleDetailController --> "1" SaleDetail : manages\n';
  uml += 'SaleDetailController --> "1" DatabasePool : uses\n';
  uml += '\n';

  uml += "' Route Dependencies\n";
  uml += 'AuthRoutes --> "1" AuthController : delegates\n';
  uml += 'ProductRoutes --> "1" ProductController : delegates\n';
  uml += 'ProductRoutes --> "1" AuthenticationMiddleware : uses\n';
  uml += 'ProductRoutes --> "1" AuthorizationMiddleware : uses\n';
  uml += 'SaleRoutes --> "1" SaleController : delegates\n';
  uml += 'SaleRoutes --> "1" AuthenticationMiddleware : uses\n';
  uml += 'SaleRoutes --> "1" AuthorizationMiddleware : uses\n';
  uml += '\n';

  uml += "' Domain Model Relationships\n";
  uml += 'Sale "*" --> "1" User : createdBy\n';
  uml += 'Sale "1" *-- "*" SaleDetail : contains\n';
  uml += 'SaleDetail "*" --> "1" Product : uses\n';
  uml += 'Product "*" --> "1" Brand : belongsTo\n';
  uml += 'Product "*" --> "1" Category : belongsTo\n';
  uml += 'User "*" --> "1" Role : hasRole\n';
  uml += '\n';

  uml += '@enduml\n';
  return uml;
}

/**
 * Función principal
 */
function main() {
  const uml = generateCompleteUML();
  const outputFile = path.join(__dirname, 'diagrama.puml');
  
  fs.writeFileSync(outputFile, uml, 'utf-8');
  
  console.log('✅ Diagrama UML COMPLETO generado en: diagrama.puml\n');
  console.log('📋 Contenido:\n');
  console.log('  ✓ INFRASTRUCTURE LAYER (Singletons):');
  console.log('    - DatabasePool (Singleton)');
  console.log('    - SupabaseClient (Singleton)\n');
  console.log('  ✓ MIDDLEWARE LAYER:');
  console.log('    - AuthenticationMiddleware');
  console.log('    - AuthorizationMiddleware');
  console.log('    - ErrorHandlerMiddleware\n');
  console.log('  ✓ CONTROLLER LAYER:');
  console.log('    - AuthController');
  console.log('    - ProductController');
  console.log('    - SaleController');
  console.log('    - SaleDetailController\n');
  console.log('  ✓ ROUTE LAYER:');
  console.log('    - AuthRoutes');
  console.log('    - ProductRoutes');
  console.log('    - SaleRoutes\n');
  console.log('  ✓ DOMAIN LAYER (Models):');
  console.log('    - User, Product, Sale, SaleDetail');
  console.log('    - Brand, Category, Role\n');
  console.log('  ✓ DESIGN PATTERNS:');
  console.log('    - Singleton Pattern (DatabasePool, SupabaseClient)');
  console.log('    - MVC Pattern (Controllers + Routes)');
  console.log('    - Middleware Pattern (Authentication, Authorization)\n');
  console.log('  ✓ ALL RELATIONSHIPS & DEPENDENCIES\n');
  console.log('🎨 Visualizar en: https://www.plantuml.com/plantuml/uml/\n');
}

main();
