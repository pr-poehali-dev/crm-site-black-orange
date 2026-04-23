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
              КРМП
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
              <span style={{ color: "#F0F0F0" }}>ДОБРО</span>
              <br />
              <span className="gradient-text-orange glow-text-orange">ПОЖАЛОВАТЬ</span>
              <br />
              <span style={{ color: "#F0F0F0" }}>В КРМП</span>
            </h1>
            <p className="font-golos text-lg md:text-xl mb-8 animate-fade-in-up delay-200" style={{ color: "#888", maxWidth: "520px", lineHeight: "1.7" }}>
              Крутой ролевой мир с живой экономикой, реальными людьми и бесконечными возможностями. Твоя история начинается здесь.
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
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase mb-4 animate-fade-in-up">
            Почему <span className="gradient-text-orange">КРМП</span>?
          </h2>
          <p className="font-golos text-base" style={{ color: "#666" }}>Всё, что нужно для идеального ролевого опыта</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
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
        <span style={{ color: "#FF6A00" }} className="font-oswald font-bold tracking-widest">КРМП</span>
        {" "}© 2024 — Все права защищены
      </footer>
    </div>
  );
}

/* ======================== HOW TO PLAY ======================== */
function HowToPlayPage() {
  const steps = [
    { step: "01", title: "Зарегистрируйся", desc: "Создай аккаунт на нашем сайте — это займёт меньше минуты. Придумай имя персонажа и заполни анкету.", icon: "UserPlus" },
    { step: "02", title: "Установи клиент", desc: "Скачай и установи SAMP клиент версии 0.3.7. Добавь наш сервер в список: play.krmp.ru:7777.", icon: "Download" },
    { step: "03", title: "Изучи правила", desc: "Ознакомься с правилами сервера. Это важно — незнание правил не освобождает от наказания.", icon: "BookOpen" },
    { step: "04", title: "Выбери фракцию", desc: "На старте тебе доступны базовые профессии. Покупай бизнес, вступай в фракции и развивай персонажа.", icon: "Users" },
    { step: "05", title: "Начни играть", desc: "Заходи на сервер, знакомься с игроками, зарабатывай деньги и строй свою репутацию.", icon: "Play" },
  ];
  const rules = [
    "Запрещён читерство и использование багов",
    "Roleplay обязателен — играй роль своего персонажа",
    "Уважай других игроков и администрацию",
    "Запрещены оскорбления и токсичное поведение",
    "DM (убийство без причины) строго запрещён",
    "Реклама других серверов — бан навсегда",
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}>
          <Icon name="Gamepad2" size={14} />Руководство новичка
        </div>
        <h1 className="font-oswald text-5xl font-bold uppercase mb-3">Как <span className="gradient-text-orange">начать играть</span></h1>
        <p className="font-golos text-base" style={{ color: "#666" }}>5 простых шагов от регистрации до первой игровой сессии</p>
      </div>
      <div className="space-y-4 mb-16">
        {steps.map((s, i) => (
          <div key={i} className="card-hover rounded-xl p-6 flex gap-6 animate-fade-in-up" style={{ backgroundColor: "#141414", animationDelay: `${i * 0.08}s` }}>
            <div className="flex-shrink-0"><div className="font-oswald text-4xl font-bold" style={{ color: "rgba(255,106,0,0.2)" }}>{s.step}</div></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "rgba(255,106,0,0.1)" }}><Icon name={s.icon} size={16} style={{ color: "#FF6A00" }} /></div>
                <h3 className="font-oswald text-xl font-semibold uppercase tracking-wide">{s.title}</h3>
              </div>
              <p className="font-golos text-sm leading-relaxed" style={{ color: "#777" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-8 animate-fade-in-up" style={{ backgroundColor: "#141414", border: "1px solid rgba(255,106,0,0.15)" }}>
        <div className="flex items-center gap-3 mb-6"><Icon name="AlertTriangle" size={22} style={{ color: "#FF6A00" }} /><h2 className="font-oswald text-2xl font-bold uppercase">Основные правила</h2></div>
        <div className="grid md:grid-cols-2 gap-3">
          {rules.map((r, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "rgba(255,106,0,0.2)", color: "#FF6A00" }}>{i + 1}</div>
              <span className="font-golos text-sm" style={{ color: "#AAA" }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================== FORUM ======================== */
function ForumPage() {
  const categories = [
    { title: "Объявления", desc: "Официальные новости и обновления сервера", icon: "Megaphone", posts: 12, color: "#FF6A00" },
    { title: "Общение", desc: "Свободное общение игроков", icon: "MessageCircle", posts: 847, color: "#4CAF50" },
    { title: "Помощь", desc: "Вопросы и ответы, помощь новичкам", icon: "HelpCircle", posts: 234, color: "#2196F3" },
    { title: "Жалобы", desc: "Подача жалоб на игроков и администрацию", icon: "Flag", posts: 56, color: "#F44336" },
    { title: "Предложения", desc: "Идеи и предложения по улучшению сервера", icon: "Lightbulb", posts: 189, color: "#9C27B0" },
    { title: "Фракции", desc: "Обсуждение фракций, наборы, новости", icon: "Shield", posts: 312, color: "#FF9800" },
  ];
  const recentPosts = [
    { author: "Admin_Pavel", title: "Обновление 2.5 — патч-ноты", time: "2 часа назад", category: "Объявления" },
    { author: "BigBoss_Mike", title: "Ищу партнёра по бизнесу", time: "4 часа назад", category: "Общение" },
    { author: "NewPlayer99", title: "Как получить первую работу?", time: "5 часов назад", category: "Помощь" },
    { author: "CarDealer_Alex", title: "Продаётся Infernus — дёшево", time: "6 часов назад", category: "Общение" },
    { author: "CopOfficer_Dima", title: "Набор в LSPD открыт!", time: "8 часов назад", category: "Фракции" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-10 animate-fade-in-up">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}><Icon name="MessageSquare" size={14} />Сообщество</div>
          <h1 className="font-oswald text-5xl font-bold uppercase"><span className="gradient-text-orange">Форум</span></h1>
        </div>
        <button className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded font-oswald text-sm font-medium uppercase tracking-wider transition-all hover:scale-105" style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}><Icon name="Plus" size={16} />Новая тема</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {categories.map((cat, i) => (
          <div key={i} className="card-hover rounded-xl p-5 cursor-pointer animate-fade-in-up" style={{ backgroundColor: "#141414", animationDelay: `${i * 0.07}s` }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}18` }}><Icon name={cat.icon} size={20} style={{ color: cat.color }} /></div>
              <div>
                <h3 className="font-oswald text-lg font-semibold uppercase tracking-wide mb-1">{cat.title}</h3>
                <p className="font-golos text-xs mb-2" style={{ color: "#666" }}>{cat.desc}</p>
                <span className="font-golos text-xs" style={{ color: "#444" }}>{cat.posts} тем</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden animate-fade-in-up" style={{ border: "1px solid #252525" }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: "#141414", borderBottom: "1px solid #252525" }}><Icon name="Clock" size={18} style={{ color: "#FF6A00" }} /><h2 className="font-oswald text-xl font-bold uppercase">Последние обсуждения</h2></div>
        {recentPosts.map((post, i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-white/5" style={{ borderBottom: i < recentPosts.length - 1 ? "1px solid #1A1A1A" : "none" }}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm font-bold" style={{ backgroundColor: "rgba(255,106,0,0.15)", color: "#FF6A00" }}>{post.author[0]}</div>
              <div><p className="font-golos text-sm font-medium">{post.title}</p><p className="font-golos text-xs" style={{ color: "#555" }}>{post.author}</p></div>
            </div>
            <div className="text-right">
              <span className="inline-block text-xs font-golos px-2 py-0.5 rounded mb-1" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF8C00" }}>{post.category}</span>
              <p className="font-golos text-xs" style={{ color: "#444" }}>{post.time}</p>
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
    { title: "Discord", desc: "Основное сообщество сервера", value: "discord.gg/krmp", icon: "MessageCircle", color: "#7289DA" },
    { title: "Telegram", desc: "Новости и объявления", value: "@krmp_official", icon: "Send", color: "#2CA5E0" },
    { title: "VKontakte", desc: "Группа ВКонтакте", value: "vk.com/krmp", icon: "Users", color: "#4C75A3" },
    { title: "Email", desc: "Для официальных обращений", value: "admin@krmp.ru", icon: "Mail", color: "#FF6A00" },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-golos mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,106,0,0.1)", color: "#FF6A00", border: "1px solid rgba(255,106,0,0.2)" }}><Icon name="Phone" size={14} />Связаться с нами</div>
        <h1 className="font-oswald text-5xl font-bold uppercase"><span className="gradient-text-orange">Контакты</span></h1>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {contacts.map((c, i) => (
          <div key={i} className="card-hover rounded-xl p-6 flex items-center gap-5 cursor-pointer animate-fade-in-up" style={{ backgroundColor: "#141414", animationDelay: `${i * 0.1}s` }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${c.color}18`, border: `1px solid ${c.color}30` }}><Icon name={c.icon} size={26} style={{ color: c.color }} /></div>
            <div>
              <h3 className="font-oswald text-xl font-bold uppercase tracking-wide mb-0.5">{c.title}</h3>
              <p className="font-golos text-xs mb-1.5" style={{ color: "#555" }}>{c.desc}</p>
              <p className="font-golos text-sm font-medium" style={{ color: c.color }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-8 animate-fade-in-up" style={{ backgroundColor: "#141414", border: "1px solid #252525" }}>
        <h2 className="font-oswald text-2xl font-bold uppercase mb-6 flex items-center gap-3"><Icon name="Mail" size={22} style={{ color: "#FF6A00" }} />Написать нам</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div><label className="font-golos text-xs block mb-2" style={{ color: "#666" }}>Имя</label><input type="text" placeholder="Ваше имя" className="w-full px-4 py-3 rounded font-golos text-sm outline-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} /></div>
          <div><label className="font-golos text-xs block mb-2" style={{ color: "#666" }}>Email</label><input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded font-golos text-sm outline-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} /></div>
        </div>
        <div className="mb-4"><label className="font-golos text-xs block mb-2" style={{ color: "#666" }}>Сообщение</label><textarea rows={4} placeholder="Ваше сообщение..." className="w-full px-4 py-3 rounded font-golos text-sm outline-none resize-none" style={{ backgroundColor: "#1A1A1A", border: "1px solid #303030", color: "#F0F0F0" }} /></div>
        <button className="flex items-center gap-2 px-8 py-3 rounded font-oswald text-sm font-medium uppercase tracking-wider transition-all hover:scale-105 glow-orange" style={{ backgroundColor: "#FF6A00", color: "#0D0D0D" }}><Icon name="Send" size={16} />Отправить</button>
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
