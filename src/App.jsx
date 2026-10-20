import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Icosahedron, Torus, Float, Sparkles as ThreeSparkles } from '@react-three/drei';
import { Shield, Zap, Cpu, ArrowRight, Check, Sparkles, Terminal, X, Send } from 'lucide-react';
import './App.css';

function CyberCore({ speed, color }) {
  const coreRef = useRef();
  const wireRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = speed * 0.5;
    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.4 * s;
      coreRef.current.rotation.z = t * 0.2 * s;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = t * 0.3 * s;
      wireRef.current.rotation.y = t * 0.5 * s;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.6 * s;
      ring1Ref.current.rotation.y = t * 0.2 * s;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.5 * s;
      ring2Ref.current.rotation.z = t * 0.4 * s;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.3 * s;
      ring3Ref.current.rotation.z = -t * 0.6 * s;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.5}>
      <Icosahedron ref={coreRef} args={[0.85, 0]}>
        <meshStandardMaterial
          color="#050609"
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
          flatShading={true}
        />
      </Icosahedron>

      <Icosahedron ref={wireRef} args={[1.35, 1]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          wireframe={true}
          transparent
          opacity={0.85}
        />
      </Icosahedron>

      <Torus ref={ring1Ref} args={[1.8, 0.02, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Torus>

      <Torus ref={ring2Ref} args={[2.1, 0.015, 16, 100]} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} transparent opacity={0.7} />
      </Torus>

      <Torus ref={ring3Ref} args={[2.4, 0.01, 16, 100]} rotation={[0, -Math.PI / 3, Math.PI / 6]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.5} />
      </Torus>

      <ThreeSparkles count={80} scale={5} size={3} speed={0.8} color={color} />
    </Float>
  );
}

export default function App() {
  const [requests, setRequests] = useState(50);
  const [isAnnual, setIsAnnual] = useState(true);
  const [coreColor, setCoreColor] = useState('#6366f1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Поля формы
  const [clientName, setClientName] = useState('');
  const [clientTg, setClientTg] = useState('');
  const [testChatId, setTestChatId] = useState(''); 

  // =========================================================================
  // 👇 ВСТАВЬ СВОЙ ТОКЕН И СВОЙ ID В КАВЫЧКИ НИЖЕ:
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const OWNER_CHAT_ID = import.meta.env.VITE_OWNER_CHAT_ID;
  // =========================================================================

  const basePrice = Math.round(requests * 0.8);
  const finalPrice = isAnnual ? Math.round(basePrice * 0.8) : basePrice;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const message = `
🚀 <b>Новая заявка с 3D-лендинга AETHER.AI!</b>

👤 <b>Клиент:</b> ${clientName}
📱 <b>Контакт:</b> ${clientTg}
⚡ <b>Мощность:</b> ${requests} 000 запросов/мес
💰 <b>Тариф:</b> $${finalPrice}/мес (${isAnnual ? 'Годовой -20%' : 'Помесячно'})
🎨 <b>Спектр ядра:</b> ${coreColor}
    `;

    try {
      if (TELEGRAM_BOT_TOKEN && !TELEGRAM_BOT_TOKEN.includes('ВСТАВЬ')) {
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: OWNER_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }),
        });

        
        if (testChatId.trim() !== '') {
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: testChatId.trim(),
              text: `🎯 <b>ДЕМО-РЕЖИМ ПОРТФОЛИО:</b>\nИменно так заявки от ваших клиентов будут мгновенно прилетать вам в Telegram!\n` + message,
              parse_mode: 'HTML',
            }),
          });
        }
      }

      setFormSent(true);
      setClientName('');
      setClientTg('');
      setTestChatId('');
      setTimeout(() => {
        setFormSent(false);
        setIsModalOpen(false);
      }, 2500);
    } catch (error) {
      alert('Ошибка при отправке. Проверьте подключение.');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      {/* Навигация */}
      <nav className="navbar glass">
        <div className="logo">
          <Sparkles size={24} style={{ color: coreColor }} />
          <span>AETHER<b>.AI</b></span>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => scrollToSection('features')}>Технологии</button>
          <button className="nav-btn" onClick={() => scrollToSection('calculator')}>Калькулятор</button>
          <button className="btn-small" onClick={() => setIsModalOpen(true)}>
            Запустить MVP
          </button>
        </div>
      </nav>

      {/* Главный экран */}
      <header className="hero-section">
        <div className="hero-left">
          <div className="badge glass">
            <span className="pulse-dot"></span> Доступно API v2.4
          </div>
          <h1>
            Интеллектуальное ядро <br />
            <span className="gradient-text">для вашего бизнеса</span>
          </h1>
          <p className="hero-subtitle">
            Автоматизируйте обработку данных, клиентскую поддержку и аналитику с помощью нейросетевой архитектуры нового поколения. Покрутите 3D-голограмму справа или смените спектр.
          </p>

          <div className="mode-switcher glass">
            <span>Спектр ядра:</span>
            <button
              type="button"
              className={coreColor === '#6366f1' ? 'active' : ''}
              onClick={() => setCoreColor('#6366f1')}
            >Cyber Indigo</button>
            <button
              type="button"
              className={coreColor === '#10b981' ? 'active' : ''}
              onClick={() => setCoreColor('#10b981')}
            >Matrix Emerald</button>
            <button
              type="button"
              className={coreColor === '#f43f5e' ? 'active' : ''}
              onClick={() => setCoreColor('#f43f5e')}
            >Hyper Crimson</button>
          </div>

          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={() => scrollToSection('calculator')}>
              Рассчитать стоимость <ArrowRight size={18} />
            </button>
            <button type="button" className="btn-secondary glass" onClick={() => setIsModalOpen(true)}>
              Оставить заявку
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="glow-backdrop" style={{ background: coreColor }}></div>
          <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 5]} intensity={2.5} color={coreColor} />
            <pointLight position={[-5, -5, -5]} intensity={1.5} color="#ffffff" />
            <CyberCore speed={requests / 25} color={coreColor} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
          <div className="canvas-hint">🖱️ Покрутите 3D-ядро мышкой</div>
        </div>
      </header>

      {/* Секция преимуществ */}
      <section id="features" className="features-section">
        <h2>Архитектура <span className="gradient-text">высоких скоростей</span></h2>
        <div className="features-grid">
          <div className="feature-card glass">
            <Zap className="feature-icon" size={32} style={{ color: coreColor }} />
            <h3>Отклик 12 мс</h3>
            <p>Мгновенная генерация ответов и обработка вебхуков без задержек благодаря распределенным нодам.</p>
          </div>
          <div className="feature-card glass">
            <Shield className="feature-icon" size={32} style={{ color: coreColor }} />
            <h3>Zero-Knowledge защита</h3>
            <p>Сквозное шифрование всех запросов. Ваши корпоративные данные никогда не используются для дообучения.</p>
          </div>
          <div className="feature-card glass">
            <Cpu className="feature-icon" size={32} style={{ color: coreColor }} />
            <h3>Гибкая интеграция</h3>
            <p>Подключение к Telegram-ботам, CRM-системам и веб-приложениям за 5 минут через готовый SDK.</p>
          </div>
        </div>
      </section>

      {/* Интерактивный калькулятор */}
      <section id="calculator" className="calculator-section">
        <div className="calculator-box glass">
          <div className="calc-header">
            <h2>Интерактивный расчет мощности</h2>
            <p>Выберите нагрузку и формат подписки для мгновенного расчета тарифа</p>
          </div>

          <div className="calc-controls">
            <div className="slider-group">
              <div className="slider-label">
                <span>Нагрузка системы:</span>
                <strong>{requests} 000 запросов / мес</strong>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={requests}
                onChange={(e) => setRequests(Number(e.target.value))}
                className="range-slider"
              />
            </div>

            <div className="toggle-group">
              <span className={!isAnnual ? 'active-label' : ''}>Помесячно</span>
              <button
                type="button"
                className={`toggle-btn ${isAnnual ? 'checked' : ''}`}
                onClick={() => setIsAnnual(!isAnnual)}
              >
                <span className="toggle-thumb" />
              </button>
              <span className="discount-badge">Годовой (-20%)</span>
            </div>
          </div>

          <div className="calc-result">
            <div className="price-tag">
              <span className="currency">$</span>
              <span className="amount">{finalPrice}</span>
              <span className="period">/ месяц</span>
            </div>
            <ul className="perks-list">
              <li><Check size={16} /> Выделенный 3D/AI поток</li>
              <li><Check size={16} /> Приоритетная поддержка 24/7</li>
              <li><Check size={16} /> Доступ ко всем моделям</li>
            </ul>
            <button type="button" className="btn-primary full-width" onClick={() => setIsModalOpen(true)}>
              Развернуть кластер за ${finalPrice}/мес
            </button>
          </div>
        </div>
      </section>

      {/* Модальное окно заявки */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            {formSent ? (
              <div className="form-success">
                <Check size={48} color="#10b981" />
                <h3>Заявка улетела в Telegram!</h3>
                <p>Проверьте сообщения от бота.</p>
              </div>
            ) : (
              <>
                <h3>Запуск кластера AETHER.AI</h3>
                <p className="modal-sub">Выбранный тариф: <b>{requests}k запросов (${finalPrice}/мес)</b></p>
                <form onSubmit={handleFormSubmit} className="modal-form">
                  <input
                    type="text"
                    placeholder="Ваше имя или проект"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ваш Telegram (@username)"
                    value={clientTg}
                    onChange={(e) => setClientTg(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ваш Chat ID (необязательно — для теста бота на себе)"
                    value={testChatId}
                    onChange={(e) => setTestChatId(e.target.value)}
                  />
                  <button type="submit" className="btn-primary full-width" disabled={isSending}>
                    <Send size={18} /> {isSending ? 'Отправка в Telegram...' : 'Получить доступ к API'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Подвал */}
      <footer className="footer glass">
        <div className="footer-left">
          <Terminal size={20} /> Разработано для демонстрации 3D Web & UI возможностей.
        </div>
        <div className="footer-copy">© 2026 AETHER.AI Showcase</div>
      </footer>
    </div>
  );
}