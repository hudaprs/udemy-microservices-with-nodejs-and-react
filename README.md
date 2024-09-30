# Intro

This is Udemy Course from Stephen Grider about Microservices.
I'm using Google Cloud as Development Server.

## Set Kubernetes Clusters

```shell
gcloud container clusters get-credentials <cluster-name>
```

## Check existing Kubernetes Contexts

```shell
kubectl config get-contexts
```

## Set current active Kubernetes Context

```shell
kubectl config use-context <context-name>
```

## Set Kubernetes Secret (Opaque)

```shell
kubectl create secret generic <secret-name> --from-literal=key=value
```
