# Goose Auto Observer — Evidence

**Version:** 1.0.0  
**Audit-Pflicht:** Ja  
**Erstellt am:** 2026-06-10  

---

## 1. Typ

- **tmux:** `goose_observer_20260610` + `goose_auto_chat`

## 2. Startbefehl

```
python3 goose_output_observer.py tmux 20260610_35
```

## 3. Logpfad

```
~/.nexify/goose_auto_chat/goose_auto_chat.log
```

## 4. Stop / Pause

- **Stop:** Strg+C
- **Pause:** `python3 goose_user_chat_driver.py pause`

## 5. Status (sichtbare Informationen)

- Session-ID
- Letzte Injection
- Goose-Output
- Fehler

## 6. Funktionstests

| Test | Status |
|------|--------|
| `tmux attach` | ✅ |
| Log-Tail (tail -f) | ✅ |
| Status-Abfrage | ✅ |

---

*Ende des Evidence-Dokuments*
