package session

import (
	"errors"
	"github.com/gorilla/sessions"
	"github.com/quasoft/memstore"
	"github.com/wader/gormstore/v2"
	"net/http"
	"stock-server/config"
	"stock-server/config/db"
	"time"
)

const (
	sessionCookieStore = "cookie"
	sessionMemoryStore = "memory"
	sessionMysqlStore  = "mysql"
)

var session *Session

type sessionStore interface {
	MaxAge(age int)
	Get(r *http.Request, name string) (*sessions.Session, error)
	New(r *http.Request, name string) (*sessions.Session, error)
	Save(r *http.Request, w http.ResponseWriter, session *sessions.Session) error
}

type Session struct {
	driver string
	store  sessionStore
}

func GetSessionStore() sessionStore {
	return session.store
}

func InitSessionStore(appConfig *config.AppConfig) error {
	session = &Session{driver: appConfig.Session.Driver}
	switch session.driver {
	case sessionCookieStore:
		session.store = sessions.NewCookieStore([]byte(appConfig.Session.SecretKey))
	case sessionMemoryStore:
		session.store = memstore.NewMemStore([]byte(appConfig.Session.SecretKey))
	case sessionMysqlStore:
		gormStore := gormstore.New(db.GetDB(), []byte(appConfig.Session.SecretKey))
		quit := make(chan struct{})
		go gormStore.PeriodicCleanup(1*time.Hour, quit)
		session.store = gormStore

	default:
		return errors.New("invalid session driver")
	}

	session.store.MaxAge(appConfig.Session.LoginMaxAgeSeconds)
	return nil
}

func NewSession(store sessionStore, name string) *sessions.Session {
	session := sessions.NewSession(store, name)
	session.Options.Path = "/"
	session.Options.SameSite = http.SameSiteNoneMode
	session.Options.Secure = true
	return session
}
