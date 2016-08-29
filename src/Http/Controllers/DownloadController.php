<?php
/**
 * @Author: Duong The
 * @Date:   2016-05-30 14:47:39
 * @Last Modified by:   Duong The
 * @Last Modified time: 2016-07-14 09:18:04
 */
namespace Qsoftvn\Generator\Http\Controllers;

use App\Http\Controllers\Controller;
use File;
use Illuminate\Http\Request;

class DownloadController extends Controller
{

    /**
     * [download description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function download(Request $request)
    {
        $pathToFile = config('qsoft-generator.download_path') . '/' . $request->fileName;
        if (File::exists($pathToFile)) {
            return response()->download($pathToFile);
        }

    }
}
