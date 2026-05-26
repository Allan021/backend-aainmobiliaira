class AuthUseCases {
  constructor(userRepo, jwtService, passwordService, emailService) {
    this.userRepo = userRepo;
    this.jwt = jwtService;
    this.password = passwordService;
    this.email = emailService;
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw Object.assign(new Error('Credenciales incorrectas'), { status: 401 });

    const valid = await this.password.compare(password, user.password_hash);
    if (!valid) throw Object.assign(new Error('Credenciales incorrectas'), { status: 401 });

    const token = this.jwt.sign({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async register(email, password, name) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw Object.assign(new Error('El correo ya existe'), { status: 409 });

    const passwordHash = await this.password.hash(password);
    const user = await this.userRepo.create({ email, password_hash: passwordHash, name, role: 'admin' });
    const token = this.jwt.sign({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async me(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async googleLogin(profile) {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    if (!email) throw Object.assign(new Error('No email found in Google profile'), { status: 400 });
    
    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      const name = profile.displayName || email.split('@')[0];
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await this.password.hash(randomPassword);
      user = await this.userRepo.create({ email, password_hash: passwordHash, name, role: 'admin' });
    }
    
    const token = this.jwt.sign({ id: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async listUsers() {
    const users = await this.userRepo.findAll();
    return users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, created_at: u.created_at }));
  }

  async createTeamMember(email, password, name) {
    if (!email || !password || !name) {
      throw Object.assign(new Error('Todos los campos son requeridos'), { status: 400 });
    }
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw Object.assign(new Error('El correo ya existe'), { status: 409 });

    const passwordHash = await this.password.hash(password);
    const user = await this.userRepo.create({ email, password_hash: passwordHash, name, role: 'admin' });

    if (this.email) {
      this.email.sendWelcomeEmail(email, name, password).catch(err => {
        console.error('[AuthUseCases] Failed to send welcome email in background:', err.message);
      });
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role, created_at: user.created_at };
  }
}

module.exports = AuthUseCases;
