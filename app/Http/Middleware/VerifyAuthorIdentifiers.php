<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerifyAuthorIdentifiers {
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response {
        if (!Auth::check() || !Auth::user()->isStaff())
            return $next($request);

        // Get the current route name
        $currentRoute = $request->route()->getName();

        // Check if the user is missing all identifiers and not already on the verify author page
//        if (Auth::user()->missingAllIdentifiers() && $currentRoute !== 'Auth.Verify.Author')
//            return redirect()->route('Auth.Verify.Author');

        return $next($request);
    }
}
