import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "contacts" | "howtoplay" | "forum" | "interesting" | "settings";
type Modal = "none" | "login" | "register" | "passport";

const AUTH_URL = "https://functions.poehali.dev/72db4f29-a2fe-4132-ba07-b66626ff7a88";
const HERO_IMAGE = "https://cdn.poehali.dev/projects/4938e47a-6809-4c50-ab64-4f2d7ba53829/files/4ec499ee-ff94-4832-a5ff-428104897e31.jpg";

interface Player {
  id: number;
  username: string;
  nickname: string;
  faction: string;
  rank: string;
  money: number;
  bank: number;
  level: number;
  hours_played: number;
  warnings: number;
  avatar_letter: string;
  created_at: string;
}

async function apiAuth(action: string, method: string, body?: object, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Session-Token"] = token;
  const res = await fetch(`${AUTH_URL}?action=${action}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export default function Index() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>("none");
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("krmp_token");
    if (token) {
      apiAuth("me", "GET", undefined, token).then((data) => {
        if (data.player) setPlayer(data.player);
        else localStorage.removeItem("krmp_token");
      });
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("krmp_token");
    if (token) await apiAuth("logout", "POST", undefined, token);
    localStorage.removeItem("krmp_token");
    setPlayer(null);
    setModal("none");
  };

  const navItems = [
    { id: "home" as Page, label: "Главная", icon: "Home" },
    { id: "howtoplay" as Page, label: "Как играть", icon: "Gamepad2" },
    { id: "forum" as Page, label: "Форум", icon: "MessageSquare" },
    { id: "interesting" as Page, label: "Интересное", icon: "Sparkles" },
    { id: "contacts" as Page, label: "Контакты", icon: "Phone" },
    { id: "settings" as Page, label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen grid-bg noise-bg" style={{ backgroundColor: "#0D0D0D", color: "#F0F0F0" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: "rgba(13,13,13,0.95)", borderColor: "#252525", backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage("home")}>
            <div className="w-8 h-8 rounded flex items-center justify-center animate-pulse-orange" style={{ backgroundColor: "#FF6A00" }}>
              <Icon name="Zap" size={18} style={{ color: "#0D0D0D" }} />
            </div>
            <span className="font-oswald text-xl font-bold tracking-widest uppercase animate-flicker" style={{ color: "#FF6A00" }}>
              VINEWOOD RP
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`nav-link px-4 py-2 rounded text-sm font-golos font-medium tracking-wide transition-all ${activePage === item.id ? "active" : "text-gray-400 hover:text-white"}`}
                style={activePage === item.id ? { color: "#FF6A00" } : {}}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-golos" style={{ color: "#4CAF50" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#4CAF50" }} />
              <span>Онлайн: 247</span>
            </div>
            {player ? (
              <button
                onClick={() => setModal("passport")}
                className="flex items-center gap-2 px-4 py-2 rounded font-golos text-sm font-medium transition-all hover:scale-105"
                style={{ backgroundColor: "rgba(255,106,0,0.15)", border: "1px solid rgba(255,106,0,0.3)", color: "#FF8C00" }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-oswald text-xs font-bold" style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}>
                  {player.avatar_letter}
                </div>
                {player.nickname}
              </button>
            ) : (
              <button
                onClick={() => setModal("login")}
                className="px-4 py-2 rounded font-oswald text-sm font-medium tracking-wider uppercase transition-all hover:scale-105"
                style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}
              >
                Войти
              </button>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "#FF6A00" }}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t animate-fade-in" style={{ backgroundColor: "#0D0D0D", borderColor: "#252525" }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-6 py-3 text-left font-golos text-sm transition-colors"
                style={activePage === item.id ? { color: "#FF6A00", backgroundColor: "#141414" } : { color: "#999" }}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
            {!player && (
              <button onClick={() => { setModal("login"); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-6 py-3 font-oswald text-sm uppercase tracking-wider" style={{ color: "#FF6A00" }}>
                <Icon name="LogIn" size={16} />
                Войти
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="pt-16">
        {activePage === "home" && <HomePage onNavigate={setActivePage} onLogin={() => setModal("login")} player={player} onPassport={() => setModal("passport")} />}
        {activePage === "howtoplay" && <HowToPlayPage />}
        {activePage === "forum" && <ForumPage />}
        {activePage === "interesting" && <InterestingPage />}
        {activePage === "contacts" && <ContactsPage />}
        {activePage === "settings" && <SettingsPage />}
      </main>

      {/* MODALS */}
      {modal === "login" && <LoginModal onClose={() => setModal("none")} onRegister={() => setModal("register")} onSuccess={(p) => { setPlayer(p); setModal("none"); }} />}
      {modal === "register" && <RegisterModal onClose={() => setModal("none")} onLogin={() => setModal("login")} onSuccess={(p) => { setPlayer(p); setModal("none"); }} />}
      {modal === "passport" && player && <PassportModal player={player} onClose={() => setModal("none")} onLogout={handleLogout} />}
    </div>
  );
}

/* ====== LOGIN MODAL ====== */
function LoginModal({ onClose, onRegister, onSuccess }: { onClose: () => void; onRegister: () => void; onSuccess: (p: Player) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username || !password) return setError("Заполни все поля");
    setLoading(true);
    setError("");
    const data = await apiAuth("login", "POST", { username, password });
    setLoading(false);
    if (data.error) return setError(data.error);
    localStorage.setItem("krmp_token", data.token);
    onSuccess(data.player);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-orange" style={{ backgroundColor: "rgba(255,106,0,0.15)", border: "2px solid rgba(255,106,0,0.4)" }}>
          <Icon name="LogIn" size={26} style={{ color: "#FF6A00" }} />
        </div>
        <h2 className="font-oswald text-3xl font-bold uppercase tracking-wide">Вход</h2>
        <p className="font-golos text-sm mt-1" style={{ color: "#666" }}>Войди в свой аккаунт КРМП</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-golos text-xs block mb-2" style={{ color: "#666" }}>Никнейм или Email</label>
          <input
            value={username} onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="BigBoss_Mike"
            className="w-full px-4 py-3 rounded font-golos text-sm outline-none transition-all"
            style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }}
          />
        </div>
        <div>
          <label className="font-golos text-xs block mb-2" style={{ color: "#666" }}>Пароль</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded font-golos text-sm outline-none transition-all"
            style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }}
          />
        </div>
        {error && <p className="font-golos text-sm text-center py-2 px-3 rounded" style={{ color: "#F44336", backgroundColor: "rgba(244,67,54,0.1)" }}>{error}</p>}
        <button
          onClick={submit} disabled={loading}
          className="w-full py-3 rounded font-oswald font-medium uppercase tracking-wider text-base transition-all hover:scale-105"
          style={{ backgroundColor: loading ? "#444" : "#FF6A00", color: "#0D0D0D" }}
        >
          {loading ? "Входим..." : "Войти"}
        </button>
      </div>

      <div className="mt-6 text-center">
        <span className="font-golos text-sm" style={{ color: "#555" }}>Нет аккаунта? </span>
        <button onClick={onRegister} className="font-golos text-sm font-medium transition-colors hover:underline" style={{ color: "#FF6A00" }}>
          Зарегистрироваться
        </button>
      </div>
    </ModalWrapper>
  );
}

/* ====== REGISTER MODAL ====== */
function RegisterModal({ onClose, onLogin, onSuccess }: { onClose: () => void; onLogin: () => void; onSuccess: (p: Player) => void }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", nickname: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.username || !form.email || !form.password) return setError("Заполни все обязательные поля");
    setLoading(true);
    setError("");
    const data = await apiAuth("register", "POST", { ...form, nickname: form.nickname || form.username });
    setLoading(false);
    if (data.error) return setError(data.error);
    localStorage.setItem("krmp_token", data.token);
    onSuccess(data.player);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(255,106,0,0.15)", border: "2px solid rgba(255,106,0,0.4)" }}>
          <Icon name="UserPlus" size={26} style={{ color: "#FF6A00" }} />
        </div>
        <h2 className="font-oswald text-3xl font-bold uppercase tracking-wide">Регистрация</h2>
        <p className="font-golos text-sm mt-1" style={{ color: "#666" }}>Создай персонажа и начни играть</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-golos text-xs block mb-1.5" style={{ color: "#666" }}>Никнейм *</label>
            <input value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="BigBoss_Mike" className="w-full px-3 py-2.5 rounded font-golos text-sm outline-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} />
          </div>
          <div>
            <label className="font-golos text-xs block mb-1.5" style={{ color: "#666" }}>Имя в игре</label>
            <input value={form.nickname} onChange={(e) => set("nickname", e.target.value)} placeholder="Михаил Боссов" className="w-full px-3 py-2.5 rounded font-golos text-sm outline-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} />
          </div>
        </div>
        <div>
          <label className="font-golos text-xs block mb-1.5" style={{ color: "#666" }}>Email *</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="mike@email.com" className="w-full px-3 py-2.5 rounded font-golos text-sm outline-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} />
        </div>
        <div>
          <label className="font-golos text-xs block mb-1.5" style={{ color: "#666" }}>Пароль * (мин. 6 символов)</label>
          <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" className="w-full px-3 py-2.5 rounded font-golos text-sm outline-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} />
        </div>
        {error && <p className="font-golos text-sm text-center py-2 px-3 rounded" style={{ color: "#F44336", backgroundColor: "rgba(244,67,54,0.1)" }}>{error}</p>}
        <button
          onClick={submit} disabled={loading}
          className="w-full py-3 rounded font-oswald font-medium uppercase tracking-wider text-base transition-all hover:scale-105"
          style={{ backgroundColor: loading ? "#444" : "#FF6A00", color: "#0D0D0D" }}
        >
          {loading ? "Создаём..." : "Создать аккаунт"}
        </button>
      </div>

      <div className="mt-5 text-center">
        <span className="font-golos text-sm" style={{ color: "#555" }}>Уже есть аккаунт? </span>
        <button onClick={onLogin} className="font-golos text-sm font-medium hover:underline" style={{ color: "#FF6A00" }}>Войти</button>
      </div>
    </ModalWrapper>
  );
}

/* ====== PASSPORT MODAL ====== */
function PassportModal({ player, onClose, onLogout }: { player: Player; onClose: () => void; onLogout: () => void }) {
  const joinDate = new Date(player.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <ModalWrapper onClose={onClose} wide>
      {/* Passport header */}
      <div className="relative rounded-xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #1A0A00 0%, #2A1100 50%, #1A0A00 100%)", border: "1px solid rgba(255,106,0,0.3)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,106,0,0.1) 10px, rgba(255,106,0,0.1) 11px)" }} />
        <div className="relative p-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-oswald text-4xl font-bold glow-orange" style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}>
              {player.avatar_letter}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#4CAF50", border: "2px solid #0D0D0D" }}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          {/* Info */}
          <div>
            <div className="font-golos text-xs mb-1" style={{ color: "rgba(255,106,0,0.6)" }}>ПАСПОРТ ИГРОКА · ID #{player.id}</div>
            <h2 className="font-oswald text-3xl font-bold uppercase" style={{ color: "#FF6A00" }}>{player.nickname}</h2>
            <p className="font-golos text-sm" style={{ color: "#888" }}>@{player.username}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-golos px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(255,106,0,0.15)", color: "#FF8C00", border: "1px solid rgba(255,106,0,0.3)" }}>
                {player.rank}
              </span>
              <span className="text-xs font-golos px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#666" }}>
                {player.faction}
              </span>
            </div>
          </div>
          {/* Level */}
          <div className="ml-auto text-center">
            <div className="font-oswald text-5xl font-bold gradient-text-orange">{player.level}</div>
            <div className="font-golos text-xs" style={{ color: "#555" }}>УРОВЕНЬ</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Баланс", value: `$${player.money.toLocaleString()}`, icon: "Wallet", color: "#4CAF50" },
          { label: "Банк", value: `$${player.bank.toLocaleString()}`, icon: "Building", color: "#2196F3" },
          { label: "Часов в игре", value: player.hours_played.toString(), icon: "Clock", color: "#FF6A00" },
          { label: "Предупреждения", value: player.warnings.toString(), icon: "AlertTriangle", color: player.warnings > 0 ? "#F44336" : "#666" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: "#141414", border: "1px solid #252525" }}>
            <Icon name={s.icon} size={20} style={{ color: s.color, margin: "0 auto 8px" }} />
            <div className="font-oswald text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="font-golos text-xs" style={{ color: "#555" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Extra info */}
      <div className="rounded-xl p-4 mb-5 flex items-center justify-between" style={{ backgroundColor: "#141414", border: "1px solid #252525" }}>
        <div className="flex items-center gap-2 font-golos text-sm" style={{ color: "#666" }}>
          <Icon name="Calendar" size={16} style={{ color: "#555" }} />
          Дата регистрации: <span style={{ color: "#AAA" }}>{joinDate}</span>
        </div>
        <div className="flex items-center gap-2 font-golos text-sm" style={{ color: "#4CAF50" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#4CAF50" }} />
          В сети
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded font-oswald text-sm font-medium uppercase tracking-wider transition-all hover:scale-105" style={{ backgroundColor: "#1A1A1A", color: "#888", border: "1px solid #252525" }}>
          Закрыть
        </button>
        <button onClick={onLogout} className="flex items-center gap-2 justify-center px-6 py-3 rounded font-oswald text-sm font-medium uppercase tracking-wider transition-all hover:scale-105" style={{ backgroundColor: "rgba(244,67,54,0.1)", color: "#F44336", border: "1px solid rgba(244,67,54,0.3)" }}>
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>
    </ModalWrapper>
  );
}

/* ====== MODAL WRAPPER ====== */
function ModalWrapper({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div
        className="relative w-full rounded-2xl p-7 animate-fade-in-up"
        style={{ maxWidth: wide ? "600px" : "420px", backgroundColor: "#111", border: "1px solid #252525", boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,106,0,0.05)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded transition-colors hover:bg-white/10" style={{ color: "#555" }}>
          <Icon name="X" size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ======================== HOME ======================== */
function HomePage({ onNavigate, onLogin, player, onPassport }: { onNavigate: (p: Page) => void; onLogin: () => void; player: Player | null; onPassport: () => void }) {
  const stats = [
    { label: "Игроков онлайн", value: "247", icon: "Users" },
    { label: "Дней работы", value: "847", icon: "Calendar" },
    { label: "Активных аккаунтов", value: "12K+", icon: "UserCheck" },
    { label: "Фракций", value: "34", icon: "Shield" },
  ];

  const features = [
    { title: "Реалистичный ролевой мир", desc: "Полноценная экономика, правительство, преступный мир — живи своей жизнью в виртуальном городе.", icon: "Globe" },
    { title: "Уникальные фракции", desc: "Полиция, мафия, армия, бизнес — выбери свой путь и поднимайся по карьерной лестнице.", icon: "Shield" },
    { title: "Активное сообщество", desc: "Тысячи живых игроков, регулярные ивенты и постоянные обновления каждую неделю.", icon: "Users" },
    { title: "Честная игра", desc: "Строгий анти-чит, справедливая администрация и прозрачные правила для всех.", icon: "CheckCircle" },
  ];

  return (
    <div>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.6) 50%, rgba(13,13,13,0.95) 100%)" }} />
        </div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(255,106,0,0.08)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(255,106,0,0.06)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
          <div className="max-w-3xl">
            {player ? (
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-golos font-medium mb-6 animate-fade-in cursor-pointer" style={{ backgroundColor: "rgba(255,106,0,0.15)", border: "1px solid rgba(255,106,0,0.3)", color: "#FF8C00" }} onClick={onPassport}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-oswald text-xs font-bold" style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}>{player.avatar_letter}</div>
                Добро пожаловать, <strong>{player.nickname}</strong> · Уровень {player.level}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-golos font-medium mb-6 animate-fade-in" style={{ backgroundColor: "rgba(255,106,0,0.15)", border: "1px solid rgba(255,106,0,0.3)", color: "#FF8C00" }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#FF6A00" }} />
                Сервер работает — заходи прямо сейчас
              </div>
            )}
            <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-none mb-4 animate-fade-in-up" style={{ letterSpacing: "0.02em" }}>
              <span style={{ color: "#F0F0F0" }}>VINEWOOD</span>
              <br />
              <span className="gradient-text-orange glow-text-orange">ROLE PLAY</span>
            </h1>
            <p className="font-golos text-lg md:text-xl mb-8 animate-fade-in-up delay-200" style={{ color: "#888", maxWidth: "520px", lineHeight: "1.7" }}>
              Живой город, настоящие люди, реальные судьбы. Здесь каждый сам пишет свою историю — от уличного бродяги до главы мафии.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <button
                className="flex items-center gap-2 px-8 py-4 rounded font-oswald font-medium text-lg uppercase tracking-wider transition-all hover:scale-105 glow-orange"
                style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}
                onClick={() => onNavigate("howtoplay")}
              >
                <Icon name="Play" size={20} />
                Начать играть
              </button>
              {!player && (
                <button
                  className="flex items-center gap-2 px-8 py-4 rounded font-oswald font-medium text-lg uppercase tracking-wider transition-all hover:scale-105"
                  style={{ backgroundColor: "transparent", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.4)" }}
                  onClick={onLogin}
                >
                  <Icon name="LogIn" size={20} />
                  Войти
                </button>
              )}
              {player && (
                <button
                  className="flex items-center gap-2 px-8 py-4 rounded font-oswald font-medium text-lg uppercase tracking-wider transition-all hover:scale-105"
                  style={{ backgroundColor: "transparent", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.4)" }}
                  onClick={onPassport}
                >
                  <Icon name="IdCard" size={20} />
                  Мой паспорт
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-600" style={{ color: "#555" }}>
          <span className="font-golos text-xs tracking-widest uppercase">Листай вниз</span>
          <Icon name="ChevronDown" size={20} className="animate-bounce" />
        </div>
      </section>

      <section className="py-16 relative" style={{ borderTop: "1px solid #252525", borderBottom: "1px solid #252525" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,106,0,0.03), transparent)" }} />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.2)" }}>
                    <Icon name={s.icon} size={22} style={{ color: "#FF6A00" }} />
                  </div>
                </div>
                <div className="font-oswald text-3xl font-bold mb-1 gradient-text-orange">{s.value}</div>
                <div className="font-golos text-sm" style={{ color: "#666" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-golos mb-4" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF8C00", border: "1px solid rgba(255,106,0,0.2)" }}>
            <Icon name="Star" size={12} />
            Почему именно мы
          </div>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase mb-5 animate-fade-in-up">
            Мы не просто <span className="gradient-text-orange">сервер</span>
          </h2>
          <p className="font-golos text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "#666" }}>
            Vinewood Role Play — это живое сообщество, где каждый игрок имеет значение. Мы создаём не просто игру, а целый мир с характером, историей и душой.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {features.map((f, i) => (
            <div key={i} className="card-hover rounded-xl p-6 animate-fade-in-up" style={{ backgroundColor: "#141414", animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,106,0,0.1)" }}>
                <Icon name={f.icon} size={20} style={{ color: "#FF6A00" }} />
              </div>
              <h3 className="font-oswald text-lg font-semibold mb-2 uppercase tracking-wide">{f.title}</h3>
              <p className="font-golos text-sm leading-relaxed" style={{ color: "#666" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Большой блок "Почему мы" */}
        <div className="rounded-2xl overflow-hidden animate-fade-in-up" style={{ background: "linear-gradient(135deg, #141414 0%, #1A0D00 100%)", border: "1px solid rgba(255,106,0,0.2)" }}>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-10 flex flex-col justify-center">
              <h3 className="font-oswald text-3xl font-bold uppercase mb-4">
                Мы строим <span className="gradient-text-orange">город мечты</span>
              </h3>
              <p className="font-golos text-base leading-relaxed mb-6" style={{ color: "#777" }}>
                Vinewood — это не клон другого сервера. Каждый скрипт, каждая система и каждое событие созданы с нуля, специально для нашего сообщества. Мы слушаем игроков и меняемся вместе с ними.
              </p>
              <div className="space-y-3">
                {[
                  "Уникальные кастомные скрипты",
                  "Активная команда разработки",
                  "Честная экономика без доната",
                  "Живые ивенты каждую неделю",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,106,0,0.2)" }}>
                      <Icon name="Check" size={12} style={{ color: "#FF6A00" }} />
                    </div>
                    <span className="font-golos text-sm" style={{ color: "#AAA" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-10 flex flex-col justify-center gap-5" style={{ borderLeft: "1px solid rgba(255,106,0,0.1)" }}>
              {[
                { q: "Зачем идти именно к нам?", a: "Потому что здесь тебя не встретит безлюдный сервер или токсичная атмосфера — только дружное сообщество и интересный геймплей." },
                { q: "Это сложно для новичка?", a: "Нет. У нас есть наставники, гайды и активный чат поддержки — ты разберёшься за пару часов и уже начнёшь зарабатывать." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: "rgba(255,106,0,0.05)", border: "1px solid rgba(255,106,0,0.1)" }}>
                  <p className="font-oswald text-sm uppercase tracking-wide mb-2" style={{ color: "#FF6A00" }}>{item.q}</p>
                  <p className="font-golos text-sm leading-relaxed" style={{ color: "#666" }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden" style={{ borderTop: "1px solid #252525" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,106,0,0.05) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase mb-6 animate-fade-in-up">
            Готов начать <span className="gradient-text-orange">свою историю</span>?
          </h2>
          <p className="font-golos text-base mb-8 animate-fade-in-up delay-200" style={{ color: "#666" }}>
            Зарегистрируйся, установи клиент и заходи — всё просто.
          </p>
          <button
            className="inline-flex items-center gap-2 px-10 py-4 rounded font-oswald text-lg font-medium uppercase tracking-wider transition-all hover:scale-105 animate-pulse-orange"
            style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}
            onClick={() => onNavigate("howtoplay")}
          >
            <Icon name="ArrowRight" size={22} />
            Как начать играть
          </button>
        </div>
      </section>

      <footer className="py-8 text-center font-golos text-sm border-t" style={{ borderColor: "#252525", color: "#444" }}>
        <span style={{ color: "#FF6A00" }} className="font-oswald font-bold tracking-widest">VINEWOOD ROLE PLAY</span>
        {" "}© 2025 — Все права защищены
      </footer>
    </div>
  );
}

/* ======================== HOW TO PLAY ======================== */
function HowToPlayPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
      <div className="relative inline-block mb-8">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(255,106,0,0.08)", border: "2px solid rgba(255,106,0,0.2)" }}>
          <Icon name="Wrench" size={48} style={{ color: "rgba(255,106,0,0.5)" }} />
        </div>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-golos mb-6" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF8C00", border: "1px solid rgba(255,106,0,0.3)" }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FF6A00" }} />
        В разработке
      </div>
      <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase mb-6">
        Как <span className="gradient-text-orange">начать играть</span>
      </h1>
      <p className="font-golos text-lg leading-relaxed mb-4" style={{ color: "#666", maxWidth: "480px", margin: "0 auto 16px" }}>
        Мы активно работаем над этим разделом. Скоро здесь появится полное руководство для новых игроков.
      </p>
      <p className="font-golos text-sm" style={{ color: "#444" }}>
        Следи за обновлениями в нашем{" "}
        <a href="https://discord.gg/xWx4Pv82" target="_blank" rel="noopener noreferrer" style={{ color: "#7289DA" }}>Discord</a>
        {" "}и{" "}
        <a href="https://vk.com/vinewoodrp2" target="_blank" rel="noopener noreferrer" style={{ color: "#4C75A3" }}>ВКонтакте</a>
      </p>
      <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[
          { label: "Гайд для новичка", icon: "BookOpen" },
          { label: "Список фракций", icon: "Shield" },
          { label: "Правила сервера", icon: "FileText" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl p-5 flex flex-col items-center gap-3 opacity-40" style={{ backgroundColor: "#141414", border: "1px solid #252525" }}>
            <Icon name={item.icon} size={22} style={{ color: "#FF6A00" }} />
            <span className="font-golos text-xs text-center" style={{ color: "#666" }}>{item.label}</span>
            <span className="text-xs font-golos px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF8C00" }}>Скоро</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================== FORUM ======================== */
function ForumPage() {
  const planned = [
    { title: "Объявления", desc: "Официальные новости, патч-ноты и события от администрации", icon: "Megaphone", color: "#FF6A00" },
    { title: "Общение", desc: "Свободное общение игроков, поиск тиммейтов и знакомства", icon: "MessageCircle", color: "#4CAF50" },
    { title: "Помощь", desc: "Вопросы и ответы, поддержка новичков от опытных игроков", icon: "HelpCircle", color: "#2196F3" },
    { title: "Жалобы", desc: "Официальные жалобы на нарушителей с доказательствами", icon: "Flag", color: "#F44336" },
    { title: "Предложения", desc: "Твои идеи по развитию сервера — мы читаем каждое сообщение", icon: "Lightbulb", color: "#9C27B0" },
    { title: "Фракции", desc: "Набор в фракции, внутренние новости и взаимодействие", icon: "Shield", color: "#FF9800" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}>
          <Icon name="MessageSquare" size={14} />Сообщество
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-oswald text-5xl font-bold uppercase"><span className="gradient-text-orange">Форум</span></h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-golos" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF8C00", border: "1px solid rgba(255,106,0,0.3)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FF6A00" }} />
            В разработке
          </div>
        </div>
      </div>

      {/* Описание форума */}
      <div className="rounded-2xl p-8 mb-10 animate-fade-in-up" style={{ background: "linear-gradient(135deg, #141414, #1A0D00)", border: "1px solid rgba(255,106,0,0.2)" }}>
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.2)" }}>
            <Icon name="Construction" size={28} style={{ color: "#FF6A00" }} />
          </div>
          <div>
            <h2 className="font-oswald text-2xl font-bold uppercase mb-3">Форум Vinewood Role Play</h2>
            <p className="font-golos text-base leading-relaxed mb-4" style={{ color: "#777" }}>
              Наш форум — это центральная площадка сообщества, где игроки смогут общаться, делиться опытом, подавать жалобы и предлагать идеи. Мы хотим создать удобное и безопасное пространство для каждого участника проекта.
            </p>
            <p className="font-golos text-sm leading-relaxed" style={{ color: "#555" }}>
              Команда разработчиков активно работает над запуском форума. Пока что общение доступно в нашем{" "}
              <a href="https://discord.gg/xWx4Pv82" target="_blank" rel="noopener noreferrer" style={{ color: "#7289DA" }}>Discord-сервере</a>
              {" "}и группе{" "}
              <a href="https://vk.com/vinewoodrp2" target="_blank" rel="noopener noreferrer" style={{ color: "#4C75A3" }}>ВКонтакте</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Планируемые разделы */}
      <h2 className="font-oswald text-xl font-bold uppercase mb-5 flex items-center gap-3 animate-fade-in-up" style={{ color: "#555" }}>
        <Icon name="Layout" size={18} style={{ color: "#444" }} />
        Планируемые разделы
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planned.map((cat, i) => (
          <div key={i} className="rounded-xl p-5 opacity-60 animate-fade-in-up" style={{ backgroundColor: "#141414", border: "1px solid #1E1E1E", animationDelay: `${i * 0.07}s` }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}12` }}>
                <Icon name={cat.icon} size={20} style={{ color: cat.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-oswald text-base font-semibold uppercase tracking-wide">{cat.title}</h3>
                  <span className="text-xs font-golos px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(255,106,0,0.08)", color: "#664400" }}>Скоро</span>
                </div>
                <p className="font-golos text-xs leading-relaxed" style={{ color: "#555" }}>{cat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================== INTERESTING ======================== */
function InterestingPage() {
  const articles = [
    { title: "Топ-10 способов быстро заработать в КРМП", tag: "Советы", date: "20 апр", reads: "1.2K", icon: "TrendingUp" },
    { title: "История сервера: от первого дня до наших дней", tag: "История", date: "18 апр", reads: "876", icon: "BookOpen" },
    { title: "Лучшие машины для погонь с полицией", tag: "Транспорт", date: "15 апр", reads: "2.1K", icon: "Car" },
    { title: "Как стать лучшим копом на сервере", tag: "Фракции", date: "12 апр", reads: "654", icon: "Shield" },
    { title: "Секретные места, которые знают не все", tag: "Секреты", date: "10 апр", reads: "3.4K", icon: "Map" },
    { title: "Интервью с лидером мафии #1 сервера", tag: "Интервью", date: "8 апр", reads: "1.8K", icon: "Mic" },
  ];
  const tagColors: Record<string, string> = { "Советы": "#FF6A00", "История": "#9C27B0", "Транспорт": "#2196F3", "Фракции": "#4CAF50", "Секреты": "#F44336", "Интервью": "#FF9800" };
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}><Icon name="Sparkles" size={14} />Статьи и гайды</div>
        <h1 className="font-oswald text-5xl font-bold uppercase"><span className="gradient-text-orange">Интересное</span></h1>
        <p className="font-golos text-sm mt-2" style={{ color: "#555" }}>Гайды, истории, советы и секреты нашего сервера</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((a, i) => (
          <div key={i} className="card-hover rounded-xl overflow-hidden cursor-pointer animate-fade-in-up" style={{ backgroundColor: "#141414", animationDelay: `${i * 0.07}s` }}>
            <div className="h-32 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(255,106,0,0.08), rgba(13,13,13,0.9))", borderBottom: "1px solid #252525" }}>
              <Icon name={a.icon} size={40} style={{ color: "rgba(255,106,0,0.3)" }} />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-golos px-2 py-0.5 rounded" style={{ backgroundColor: `${tagColors[a.tag]}18`, color: tagColors[a.tag] }}>{a.tag}</span>
                <span className="text-xs font-golos" style={{ color: "#444" }}>{a.date}</span>
              </div>
              <h3 className="font-oswald text-lg font-semibold uppercase leading-tight mb-3">{a.title}</h3>
              <div className="flex items-center gap-1.5 text-xs font-golos" style={{ color: "#555" }}><Icon name="Eye" size={13} />{a.reads} просмотров</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================== CONTACTS ======================== */
function ContactsPage() {
  const contacts = [
    { title: "Discord", desc: "Официальный сервер сообщества", value: "discord.gg/xWx4Pv82", href: "https://discord.gg/xWx4Pv82", icon: "MessageCircle", color: "#7289DA" },
    { title: "VKontakte", desc: "Группа ВКонтакте", value: "vk.com/vinewoodrp2", href: "https://vk.com/vinewoodrp2", icon: "Users", color: "#4C75A3" },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}><Icon name="Phone" size={14} />Связаться с нами</div>
        <h1 className="font-oswald text-5xl font-bold uppercase"><span className="gradient-text-orange">Контакты</span></h1>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {contacts.map((c, i) => (
          <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="card-hover rounded-xl p-8 flex items-center gap-5 animate-fade-in-up no-underline" style={{ backgroundColor: "#141414", animationDelay: `${i * 0.1}s`, textDecoration: "none" }}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${c.color}18`, border: `1px solid ${c.color}40` }}><Icon name={c.icon} size={30} style={{ color: c.color }} /></div>
            <div>
              <h3 className="font-oswald text-2xl font-bold uppercase tracking-wide mb-1" style={{ color: "#F0F0F0" }}>{c.title}</h3>
              <p className="font-golos text-xs mb-2" style={{ color: "#555" }}>{c.desc}</p>
              <p className="font-golos text-sm font-medium" style={{ color: c.color }}>{c.value}</p>
            </div>
            <div className="ml-auto flex-shrink-0"><Icon name="ExternalLink" size={18} style={{ color: "#444" }} /></div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ======================== SETTINGS ======================== */
function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("ru");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className="relative inline-flex items-center w-12 h-6 rounded-full transition-all" style={{ backgroundColor: value ? "#FF6A00" : "#333" }}>
      <span className="inline-block w-4 h-4 bg-white rounded-full transition-transform" style={{ transform: value ? "translateX(26px)" : "translateX(4px)" }} />
    </button>
  );

  const sections = [
    { title: "Уведомления", icon: "Bell", items: [
      { label: "Push-уведомления", desc: "Получать уведомления о событиях сервера", value: notifications, onChange: () => setNotifications(!notifications) },
      { label: "Звуки", desc: "Звуковые оповещения", value: sounds, onChange: () => setSounds(!sounds) },
    ]},
    { title: "Интерфейс", icon: "Monitor", items: [
      { label: "Тёмная тема", desc: "Использовать тёмный режим (рекомендуется)", value: darkMode, onChange: () => setDarkMode(!darkMode) },
    ]},
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}><Icon name="Settings" size={14} />Персонализация</div>
        <h1 className="font-oswald text-5xl font-bold uppercase"><span className="gradient-text-orange">Настройки</span></h1>
      </div>
      <div className="space-y-5">
        {sections.map((sec, si) => (
          <div key={si} className="rounded-xl overflow-hidden animate-fade-in-up" style={{ border: "1px solid #252525", animationDelay: `${si * 0.1}s` }}>
            <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#141414", borderBottom: "1px solid #252525" }}><Icon name={sec.icon} size={18} style={{ color: "#FF6A00" }} /><h2 className="font-oswald text-lg font-bold uppercase tracking-wide">{sec.title}</h2></div>
            {sec.items.map((item, ii) => (
              <div key={ii} className="px-6 py-5 flex items-center justify-between transition-colors hover:bg-white/5" style={{ borderBottom: ii < sec.items.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                <div><p className="font-golos text-sm font-medium mb-0.5">{item.label}</p><p className="font-golos text-xs" style={{ color: "#555" }}>{item.desc}</p></div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        ))}
        <div className="rounded-xl overflow-hidden animate-fade-in-up delay-200" style={{ border: "1px solid #252525" }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#141414", borderBottom: "1px solid #252525" }}><Icon name="Globe" size={18} style={{ color: "#FF6A00" }} /><h2 className="font-oswald text-lg font-bold uppercase tracking-wide">Язык</h2></div>
          <div className="px-6 py-5 flex items-center justify-between">
            <div><p className="font-golos text-sm font-medium mb-0.5">Язык интерфейса</p><p className="font-golos text-xs" style={{ color: "#555" }}>Выбери язык сайта</p></div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-4 py-2 rounded font-golos text-sm outline-none cursor-pointer" style={{ backgroundColor: "#252525", color: "#F0F0F0", border: "1px solid #333" }}>
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="ua">Українська</option>
            </select>
          </div>
        </div>
        <div className="rounded-xl p-6 animate-fade-in-up delay-300" style={{ border: "1px solid rgba(244,67,54,0.2)", backgroundColor: "rgba(244,67,54,0.03)" }}>
          <h2 className="font-oswald text-lg font-bold uppercase tracking-wide mb-4 flex items-center gap-3" style={{ color: "#F44336" }}><Icon name="AlertTriangle" size={18} style={{ color: "#F44336" }} />Опасная зона</h2>
          <div className="flex items-center justify-between">
            <div><p className="font-golos text-sm font-medium mb-0.5">Удалить аккаунт</p><p className="font-golos text-xs" style={{ color: "#555" }}>Это действие необратимо</p></div>
            <button className="px-5 py-2 rounded font-oswald text-sm font-medium uppercase tracking-wider transition-all hover:scale-105" style={{ backgroundColor: "rgba(244,67,54,0.15)", color: "#F44336", border: "1px solid rgba(244,67,54,0.3)" }}>Удалить</button>
          </div>
        </div>
      </div>
    </div>
  );
}