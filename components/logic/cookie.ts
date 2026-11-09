'use client'
import { useState, useEffect } from "react"
import Cookies from 'universal-cookie'

var domLoaded: boolean = false

const Index = () => {
  useEffect(() => {
    domLoaded = true;
  }, []);
}

export function setCookie(name: string, value: string | string[] | boolean): void {
  console.log("setting cookie")
  const cookies = new Cookies()
  cookies.set(name, value)
}

export function getCookie(name: string): string | string[] {
  console.log("getting cookie")
  const cookies = new Cookies()
  return cookies.get(name)
}
