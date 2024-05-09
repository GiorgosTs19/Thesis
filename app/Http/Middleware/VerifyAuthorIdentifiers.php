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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response {
//        if(!Auth::user()->isStaff())
            return $next($request);

//        if(Auth::user()->missingAllIdentifiers())
//            return to_route('Auth.Verify.Author');

//        return $next($request);
    }
}
