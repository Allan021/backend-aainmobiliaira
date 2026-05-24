const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const errorHandler = require('./interfaces/http/middlewares/errorHandler');

// Infrastructure
const SupabasePropertyRepository = require('./infrastructure/database/SupabasePropertyRepository');
const SupabaseLeadRepository = require('./infrastructure/database/SupabaseLeadRepository');
const SupabaseSaleRepository = require('./infrastructure/database/SupabaseSaleRepository');
const SupabaseLoteRepository = require('./infrastructure/database/SupabaseLoteRepository');
const SupabaseUserRepository = require('./infrastructure/database/SupabaseUserRepository');
const JwtService = require('./infrastructure/auth/JwtService');
const PasswordService = require('./infrastructure/auth/PasswordService');
const CloudinaryService = require('./infrastructure/storage/CloudinaryService');
const FacebookService = require('./infrastructure/social/FacebookService');
const passport = require('./infrastructure/auth/PassportConfig');

// Use cases
const AuthUseCases = require('./domain/use-cases/AuthUseCases');
const PropertyUseCases = require('./domain/use-cases/PropertyUseCases');
const LeadUseCases = require('./domain/use-cases/LeadUseCases');
const SaleUseCases = require('./domain/use-cases/SaleUseCases');
const LoteUseCases = require('./domain/use-cases/LoteUseCases');

// Controllers
const AuthController = require('./interfaces/http/controllers/AuthController');
const PropertyController = require('./interfaces/http/controllers/PropertyController');
const LeadController = require('./interfaces/http/controllers/LeadController');
const SaleController = require('./interfaces/http/controllers/SaleController');
const LoteController = require('./interfaces/http/controllers/LoteController');

// Routes
const authRoutes = require('./interfaces/http/routes/auth');
const propertyRoutes = require('./interfaces/http/routes/properties');
const leadRoutes = require('./interfaces/http/routes/leads');
const saleRoutes = require('./interfaces/http/routes/sales');
const loteRoutes = require('./interfaces/http/routes/lotes');

// --- Wire dependencies ---
const propertyRepo = new SupabasePropertyRepository();
const leadRepo = new SupabaseLeadRepository();
const saleRepo = new SupabaseSaleRepository();
const loteRepo = new SupabaseLoteRepository();
const userRepo = new SupabaseUserRepository();
const jwtService = new JwtService();
const passwordService = new PasswordService();
const cloudinaryService = new CloudinaryService();
const facebookService = env.facebook.pageId && env.facebook.accessToken
  ? new FacebookService(env.facebook.pageId, env.facebook.accessToken)
  : null;

if (!facebookService) console.warn('[Facebook] Credentials missing — auto-publish disabled.');

const authUseCases = new AuthUseCases(userRepo, jwtService, passwordService);
const propertyUseCases = new PropertyUseCases(propertyRepo, cloudinaryService, facebookService);
const leadUseCases = new LeadUseCases(leadRepo);
const saleUseCases = new SaleUseCases(saleRepo);
const loteUseCases = new LoteUseCases(loteRepo);

const authController = new AuthController(authUseCases);
const propertyController = new PropertyController(propertyUseCases);
const leadController = new LeadController(leadUseCases);
const saleController = new SaleController(saleUseCases);
const loteController = new LoteController(loteUseCases);

// --- App ---
const app = express();


app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(passport.initialize());

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes(authController));
app.use('/api/properties', propertyRoutes(propertyController));
app.use('/api/leads', leadRoutes(leadController));
app.use('/api/sales', saleRoutes(saleController));
app.use('/api/lotificaciones/:lotificationId/lotes', loteRoutes(loteController));
app.use('/api/lotes', loteRoutes(loteController));

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[A&A API] Running on port ${env.port} (${env.nodeEnv})`);
});
