"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, RefreshCw } from "lucide-react"

type CodeSandboxProps = {
  code: string
  language: string
}

export function CodeSandbox({ code, language }: CodeSandboxProps) {
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runCode = async () => {
    setIsRunning(true)
    setError(null)
    setOutput("")

    try {
      if (language === "javascript" || language === "js") {
        // For JavaScript, we can use a simple sandbox approach
        // In production, this would use a secure sandbox service
        try {
          // Create a safe execution environment
          const safeEval = (code: string) => {
            // Create a sandbox with console.log that captures output
            let output = ""
            const sandbox = {
              console: {
                log: (...args: any[]) => {
                  output += args.map((arg) => String(arg)).join(" ") + "\n"
                },
                error: (...args: any[]) => {
                  output += "Error: " + args.map((arg) => String(arg)).join(" ") + "\n"
                },
                warn: (...args: any[]) => {
                  output += "Warning: " + args.map((arg) => String(arg)).join(" ") + "\n"
                },
              },
              setTimeout: () => {}, // Mock setTimeout
              setInterval: () => {}, // Mock setInterval
              fetch: () => Promise.resolve({}), // Mock fetch
            }

            // Create function with sandbox context
            const fn = new Function("sandbox", `with(sandbox) { ${code} }`)

            // Execute with timeout
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error("Execution timed out")), 5000)
            })

            return Promise.race([
              Promise.resolve().then(() => {
                fn(sandbox)
                return output
              }),
              timeoutPromise,
            ])
          }

          const result = await safeEval(code)
          setOutput(result as string)
        } catch (err: any) {
          setError(err.toString())
        }
      } else {
        setOutput(
          "Code execution for " +
            language +
            " is not supported in this demo.\n\nIn production, this would connect to a secure code execution service.",
        )
      }
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setIsRunning(false)
    }
  }

  const resetSandbox = () => {
    setOutput("")
    setError(null)
  }

  return (
    <div className="border border-zinc-800 rounded-md overflow-hidden mt-4">
      <div className="bg-zinc-900 p-2 flex justify-between items-center">
        <span className="text-sm font-medium">Code Sandbox</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={resetSandbox} disabled={isRunning || (!output && !error)}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" onClick={runCode} disabled={isRunning}>
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {(output || error) && (
        <div className="p-4 bg-black rounded-b-md">
          <div className="text-sm font-mono whitespace-pre-wrap">
            {error ? <span className="text-red-400">{error}</span> : <span className="text-green-400">{output}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
