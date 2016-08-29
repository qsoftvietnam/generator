<?php
/**
 * @Author: Duong The
 * @Date:   2016-05-30 08:45:25
 * @Last Modified by:   thedv
 * @Last Modified time: 2016-08-01 11:02:21
 */

namespace Qsoftvn\Generator\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Qsoftvn\Generator\Ultis\Generator;

class GenerateController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $gen = new Generator;

        $file = $gen->create($request->all());
        //$file = true;

        if ($file) {
            return response()->json(['message' => 'Thành công rồi. Ahihi!', 'data' => $file]);
        } else {
            return response()->json(['message' => 'Có gì đó sai sai!'], 400);
        }

    }

}
