package config

import (
	"context"
	"log"

	"github.com/sethvargo/go-envconfig"
)

type ResendConfig struct {
	ApiKey string `env:"RESEND_API_KEY"`
	Domain string `env:"RESEND_DOMAIN"`
}

type ClerkConfig struct {
	SecretKey        string `env:"CLERK_SECRET_KEY"`
	WebhookSecretKey string `env:"CLERK_WEBHOOK_SECRET_KEY"`
}

type Config struct {
	Env         string `env:"ENV,required"`
	DatabaseURL string `env:"DATABASE_URL"`
	Port        string `env:"PORT,default=8080"`
	Resend      ResendConfig
	Clerk       ClerkConfig
}

func New() *Config {
	var cfg Config
	if err := envconfig.Process(context.Background(), &cfg); err != nil {
		log.Fatalf("Failed to process environment variables: %v", err)
	}
	return &cfg
}

func (c *Config) IsProd() bool { return c.Env == "prod" }
func (c *Config) IsDev() bool  { return c.Env == "dev" }
