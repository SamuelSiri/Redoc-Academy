import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useMessageStore from '../store/messageStore';
import './MessagesPage.css';

const MessagesPage = () => {
  const { inbox, sent, currentMessage, loading, fetchInbox, fetchSent, fetchMessage, sendMessage, replyMessage, deleteMessage } = useMessageStore();
  const [tab, setTab] = useState('inbox');
  const [composing, setComposing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [form, setForm] = useState({ receiverId: '', subject: '', content: '' });
  const [replyForm, setReplyForm] = useState({ receiverId: '', subject: '', content: '' });

  useEffect(() => {
    fetchInbox();
    fetchSent();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(form);
      toast.success('Mensaje enviado');
      setComposing(false);
      setForm({ receiverId: '', subject: '', content: '' });
      fetchSent();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await replyMessage(currentMessage.id, replyForm);
      toast.success('Respuesta enviada');
      setReplying(false);
      setReplyForm({ receiverId: '', subject: '', content: '' });
      fetchMessage(currentMessage.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al responder');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      toast.success('Mensaje eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const openMessage = async (msg) => {
    await fetchMessage(msg.id);
  };

  const messages = tab === 'inbox' ? inbox : sent;

  return (
    <div className="msg">
      <div className="msg-head">
        <h1>Mensajes</h1>
        <button className="msg-compose-btn" onClick={() => setComposing(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo mensaje
        </button>
      </div>

      <div className="msg-tabs">
        <button className={`msg-tab ${tab === 'inbox' ? 'msg-tab--active' : ''}`} onClick={() => { setTab('inbox'); }}>Bandeja de entrada</button>
        <button className={`msg-tab ${tab === 'sent' ? 'msg-tab--active' : ''}`} onClick={() => { setTab('sent'); }}>Enviados</button>
      </div>

      <div className="msg-layout">
        <div className="msg-list">
          {loading ? (
            <div className="msg-empty">Cargando...</div>
          ) : messages.length === 0 ? (
            <div className="msg-empty">No hay mensajes</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`msg-item ${msg.status === 'SENT' && tab === 'inbox' ? 'msg-item--unread' : ''}`} onClick={() => openMessage(msg)}>
                <div className="msg-item-avatar">
                  {(tab === 'inbox' ? msg.sender?.name : msg.receiver?.name)?.charAt(0) || '?'}
                </div>
                <div className="msg-item-info">
                  <div className="msg-item-top">
                    <strong>{tab === 'inbox' ? msg.sender?.name : msg.receiver?.name}</strong>
                    <span className="msg-item-date">{new Date(msg.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="msg-item-subject">{msg.subject}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="msg-detail">
          {currentMessage ? (
            <div className="msg-view">
              <div className="msg-view-head">
                <h2>{currentMessage.subject}</h2>
                <div className="msg-view-meta">
                  <span>De: {currentMessage.sender?.name}</span>
                  <span>Para: {currentMessage.receiver?.name}</span>
                  <span>{new Date(currentMessage.createdAt).toLocaleString('es-ES')}</span>
                </div>
              </div>
              <div className="msg-view-body">{currentMessage.content}</div>
              <div className="msg-view-actions">
                <button className="msg-btn msg-btn--primary" onClick={() => { setReplying(true); setReplyForm({ receiverId: currentMessage.senderId, subject: `Re: ${currentMessage.subject}`, content: '' }); }}>
                  Responder
                </button>
                <button className="msg-btn msg-btn--danger" onClick={() => handleDelete(currentMessage.id)}>
                  Eliminar
                </button>
              </div>
              {currentMessage.replies?.length > 0 && (
                <div className="msg-replies">
                  <h3>Respuestas</h3>
                  {currentMessage.replies.map((reply) => (
                    <div key={reply.id} className="msg-reply">
                      <strong>{reply.sender?.name}</strong>
                      <span>{new Date(reply.createdAt).toLocaleString('es-ES')}</span>
                      <p>{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
              {replying && (
                <form className="msg-compose" onSubmit={handleReply}>
                  <h3>Responder</h3>
                  <textarea placeholder="Escribe tu respuesta..." value={replyForm.content} onChange={(e) => setReplyForm({...replyForm, content: e.target.value})} rows={4} required />
                  <div className="msg-compose-actions">
                    <button type="submit" className="msg-btn msg-btn--primary">Enviar</button>
                    <button type="button" className="msg-btn" onClick={() => setReplying(false)}>Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="msg-empty">Selecciona un mensaje para leer</div>
          )}
        </div>
      </div>

      {composing && (
        <div className="msg-modal-overlay" onClick={() => setComposing(false)}>
          <form className="msg-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSend}>
            <h2>Nuevo mensaje</h2>
            <div className="msg-field">
              <label>ID Destinatario</label>
              <input type="number" value={form.receiverId} onChange={(e) => setForm({...form, receiverId: e.target.value})} required placeholder="ID del usuario" />
            </div>
            <div className="msg-field">
              <label>Asunto</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required />
            </div>
            <div className="msg-field">
              <label>Mensaje</label>
              <textarea value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={5} required />
            </div>
            <div className="msg-compose-actions">
              <button type="submit" className="msg-btn msg-btn--primary">Enviar</button>
              <button type="button" className="msg-btn" onClick={() => setComposing(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
