import React, { useEffect, useMemo, useRef, useState } from 'react';
const API_URL=import.meta.env.VITE_URL_BACKEND ||  'http://localhost:8100/api/productos' ;
const ACCENT = '#FF4B22';

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Asterisco({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill={ACCENT}>
      <path d="M45 0h10l-4 38 27-27 7 7-27 27 38-4v10l-38-4 27 27-7 7-27-27 4 38H45l4-38-27 27-7-7 27-27-38 4V45l38 4-27-27 7-7 27 27z" />
    </svg>
  );
}

function ProductCard({ prod, index }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 4) * 90}ms` }}
      className={`group bg-white border-2 border-black rounded-2xl p-5 flex flex-col justify-between
        transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[6px_6px_0_0_#000]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-black/70 text-black/70">
          {prod.categoria}
        </span>
        <h3 className="text-xl font-black text-black mt-3 mb-1 leading-tight">
          {prod.nombre}
        </h3>
        <p className="text-sm text-black/50">
          Stock disponible: <span className="text-black font-semibold">{prod.stock}</span>
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t-2 border-black/10 pt-4">
        <span className="text-2xl font-black" style={{ color: ACCENT }}>
          S/ {Number(prod.precio).toFixed(2)}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
          <span
            className={`w-2 h-2 rounded-full ${
              prod.estado === 'DISPONIBLE' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          {prod.estado}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener la lista de productos');
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(productos.map((p) => p.categoria)));
    return ['Todos', ...unicas];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todos') return productos;
    return productos.filter((p) => p.categoria === categoriaActiva);
  }, [productos, categoriaActiva]);

  const irACatalogo = (categoria) => {
    setCategoriaActiva(categoria);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [expertiseRef, expertiseVisible] = useReveal(0.2);
  const [catalogoTituloRef, catalogoTituloVisible] = useReveal(0.3);

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            Pastelería<span style={{ color: ACCENT }}>.</span>Álvaro
          </span>
          <nav className="hidden sm:flex gap-8 text-sm font-bold uppercase tracking-wide">
            <a href="#catalogo" className="hover:opacity-60 transition-opacity">Catálogo</a>
            <a href="#nosotros" className="hover:opacity-60 transition-opacity">Nosotros</a>
            <a href="#contacto" className="hover:opacity-60 transition-opacity">Contacto</a>
          </nav>
          <a
            href="#catalogo"
            className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wide text-white px-4 sm:px-5 py-2.5 rounded-full transition-transform hover:scale-105"
            style={{ backgroundColor: ACCENT }}
          >
            Pedir ahora <span aria-hidden>→</span>
          </a>
        </div>
      </header>

      {/* Marquee */}
      <div className="bg-black text-white py-2.5 overflow-hidden border-b-2 border-black">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {['Hecho a mano', 'Ingredientes frescos', 'Recetas artesanales', 'Entrega el mismo día'].map((t) => (
                <span key={t} className="flex items-center text-sm font-bold uppercase tracking-widest px-6">
                  {t}
                  <span className="ml-6" style={{ color: ACCENT }}>✺</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      
      <section className="relative grid-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative">
          {/* Tarjetas flotantes decorativas */}
          <div className="hidden md:flex float-a absolute right-6 top-2 w-28 h-32 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0_0_#000] items-center justify-center text-6xl">
            🍰
          </div>
          <div className="hidden md:flex float-b absolute right-40 top-40 w-24 h-24 bg-white border-2 border-black rounded-full shadow-[6px_6px_0_0_#000] items-center justify-center text-4xl">
            🧁
          </div>
          <div
            className="hidden lg:block spin-slow absolute -left-10 top-24 w-24 h-24 rounded-full opacity-70"
            style={{ backgroundColor: ACCENT }}
          />

          <h1 className="font-black uppercase leading-[0.88] tracking-tight text-[15vw] sm:text-[10vw] lg:text-[7.5rem]">
            Repostería
            <br />
            <span style={{ color: ACCENT }}>Artesanal</span>
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t-2 border-black pt-8">
            <p className="text-lg text-black/70 max-w-md">
              Tortas, cheesecakes y postres preparados a diario con ingredientes
              seleccionados. Cada pieza sale de nuestro horno el mismo día que la recibes.
            </p>
            <div className="flex gap-10">
              <div>
                <p className="text-4xl font-black">
                  50<span style={{ color: ACCENT }}>+</span>
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-black/50">Recetas</p>
              </div>
              <div>
                <p className="text-4xl font-black">
                  8<span style={{ color: ACCENT }}>+</span>
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-black/50">Años</p>
              </div>
              <div>
                <p className="text-4xl font-black">
                  100<span style={{ color: ACCENT }}>%</span>
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-black/50">Artesanal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section
        id="nosotros"
        ref={expertiseRef}
        className="bg-black text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-4xl sm:text-5xl font-black uppercase mb-12 transition-all duration-700
              ${expertiseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            Nuestras <span style={{ color: ACCENT }}>Categorías</span>
          </h2>

          <div>
            {categorias
              .filter((c) => c !== 'Todos')
              .map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => irACatalogo(cat)}
                  className={`w-full flex items-center gap-6 py-6 border-t border-white/20 last:border-b
                    text-left transition-all duration-500
                    hover:pl-4 hover:opacity-100 group
                    ${expertiseVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span className="text-sm font-bold text-white/40 group-hover:text-[--accent]" style={{ '--accent': ACCENT }}>
                    0{i + 1}
                  </span>
                  <span className="text-2xl sm:text-4xl font-black uppercase group-hover:transition-colors">
                    {cat}
                  </span>
                  <span
                    className="ml-auto text-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: ACCENT }}
                  >
                    →
                  </span>
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* Catálogo de productos */}
      <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div
          ref={catalogoTituloRef}
          className={`flex items-center gap-4 mb-4 transition-all duration-700
            ${catalogoTituloVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl sm:text-6xl font-black uppercase leading-none">
            Nuestros Productos
          </h2>
          <Asterisco className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 spin-slow" />
        </div>
        <p className="text-black/50 font-medium mb-10">Catálogo actualizado en tiempo real desde nuestra API.</p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2 border-black transition-colors
                ${categoriaActiva === cat ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {cargando && (
          <div className="text-center py-16 text-black/50 font-semibold">
            Cargando catálogo desde el servidor...
          </div>
        )}

        {error && (
          <div className="p-5 rounded-xl bg-white border-2 border-rose-500 text-rose-600 text-center my-8">
            <p className="font-bold uppercase text-sm tracking-wide">No se pudo conectar con la API REST</p>
            <p className="text-sm mt-1 text-rose-500">{error}</p>
          </div>
        )}

        {!cargando && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((prod, i) => (
              <ProductCard key={prod.id} prod={prod} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="contacto" className="bg-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-black">
            Pastelería<span style={{ color: ACCENT }}>.</span>Álvaro
          </span>
          <p className="text-white/50 text-sm">&copy; 2026 Pastelería de Álvaro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}