// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { Matrix } from "../../../egret/geom/Matrix";
import { Point } from "../../../egret/geom/Point";
import { Rectangle } from "../../../egret/geom/Rectangle";
import { minWidth, minHeight } from "../core/UIComponent";
import { $TempRectangle } from "../../../egret/geom/Rectangle";


    let SOLUTION_TOLERANCE = 0.1;
    let MIN_MAX_TOLERANCE = 0.1;

    /**
     * @private
     */
    export class MatrixUtil {

        /**
         * @private
         */
        public static fitBounds(width:number, height:number, matrix:Matrix,
                                explicitWidth:number, explicitHeight:number,
                                preferredWidth:number, preferredHeight:number,
                                minWidth:number, minHeight:number,
                                maxWidth:number, maxHeight:number):Point {
            if (isNaN(width) && isNaN(height))
                return Point.create(preferredWidth, preferredHeight);

            let newMinWidth = (minWidth < MIN_MAX_TOLERANCE) ? 0 : minWidth - MIN_MAX_TOLERANCE;
            let newMinHeight = (minHeight < MIN_MAX_TOLERANCE) ? 0 : minHeight - MIN_MAX_TOLERANCE;
            let newMaxWidth = maxWidth + MIN_MAX_TOLERANCE;
            let newMaxHeight = maxHeight + MIN_MAX_TOLERANCE;

            let actualSize:Point;

            if (!isNaN(width) && !isNaN(height)) {
                actualSize = calcUBoundsToFitTBounds(width, height, matrix,
                    newMinWidth, newMinHeight,
                    newMaxWidth, newMaxHeight);

                if (!actualSize) {
                    let actualSize1:Point;
                    actualSize1 = fitTBoundsWidth(width, matrix,
                        explicitWidth, explicitHeight,
                        preferredWidth, preferredHeight,
                        newMinWidth, newMinHeight,
                        newMaxWidth, newMaxHeight);

                    if (actualSize1) {
                        let fitHeight = transformSize(actualSize1.x, actualSize1.y, matrix).height;
                        if (fitHeight - SOLUTION_TOLERANCE > height)
                        {
                            Point.release(actualSize1);
                            actualSize1 = null;
                        }
                    }

                    let actualSize2:Point
                    actualSize2 = fitTBoundsHeight(height, matrix,
                        explicitWidth, explicitHeight,
                        preferredWidth, preferredHeight,
                        newMinWidth, newMinHeight,
                        newMaxWidth, newMaxHeight);

                    if (actualSize2) {
                        let fitWidth = transformSize(actualSize2.x, actualSize2.y, matrix).width;
                        if (fitWidth - SOLUTION_TOLERANCE > width)
                        {
                            Point.release(actualSize2);
                            actualSize2 = null;
                        }
                    }

                    if (actualSize1 && actualSize2) {
                        actualSize = ((actualSize1.x * actualSize1.y) > (actualSize2.x * actualSize2.y)) ? actualSize1 : actualSize2;
                    }
                    else if (actualSize1) {
                        actualSize = actualSize1;
                    }
                    else {
                        actualSize = actualSize2;
                    }
                    Point.release(actualSize1);
                    Point.release(actualSize2);
                }
                return actualSize;
            }
            else if (!isNaN(width)) {
                return fitTBoundsWidth(width, matrix,
                    explicitWidth, explicitHeight,
                    preferredWidth, preferredHeight,
                    newMinWidth, newMinHeight,
                    newMaxWidth, newMaxHeight);
            }
            else {
                return fitTBoundsHeight(height, matrix,
                    explicitWidth, explicitHeight,
                    preferredWidth, preferredHeight,
                    newMinWidth, newMinHeight,
                    newMaxWidth, newMaxHeight);
            }
        }
    }

    /**
     * @private
     */
    function fitTBoundsWidth(width:number, matrix:Matrix,
                             explicitWidth:number, explicitHeight:number,
                             preferredWidth:number, preferredHeight:number,
                             minWidth:number, minHeight:number,
                             maxWidth:number, maxHeight:number):Point {
        let actualSize:Point;

        if (!isNaN(explicitWidth) && isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsWidth(width, matrix,
                explicitWidth, preferredHeight,
                explicitWidth, minHeight,
                explicitWidth, maxHeight);

            if (actualSize)
                return actualSize;
        }
        else if (isNaN(explicitWidth) && !isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsWidth(width, matrix,
                preferredWidth, explicitHeight,
                minWidth, explicitHeight,
                maxWidth, explicitHeight);
            if (actualSize)
                return actualSize;
        }

        actualSize = calcUBoundsToFitTBoundsWidth(width, matrix,
            preferredWidth, preferredHeight,
            minWidth, minHeight,
            maxWidth, maxHeight);

        return actualSize;
    }

    /**
     * @private
     */
    function fitTBoundsHeight(height:number, matrix:Matrix,
                              explicitWidth:number, explicitHeight:number,
                              preferredWidth:number, preferredHeight:number,
                              minWidth:number, minHeight:number,
                              maxWidth:number, maxHeight:number):Point {
        let actualSize:Point;

        if (!isNaN(explicitWidth) && isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsHeight(height, matrix,
                explicitWidth, preferredHeight,
                explicitWidth, minHeight,
                explicitWidth, maxHeight);

            if (actualSize)
                return actualSize;
        }
        else if (isNaN(explicitWidth) && !isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsHeight(height, matrix,
                preferredWidth, explicitHeight,
                minWidth, explicitHeight,
                maxWidth, explicitHeight);
            if (actualSize)
                return actualSize;
        }

        actualSize = calcUBoundsToFitTBoundsHeight(height, matrix,
            preferredWidth, preferredHeight,
            minWidth, minHeight,
            maxWidth, maxHeight);

        return actualSize;
    }


    /**
     * @private
     */
    function calcUBoundsToFitTBoundsHeight(h:number,
                                           matrix:Matrix,
                                           preferredX:number,
                                           preferredY:number,
                                           minX:number,
                                           minY:number,
                                           maxX:number,
                                           maxY:number):Point {
        let b = matrix.b;
        let d = matrix.d;

        if (-1.0e-9 < b && b < +1.0e-9)
            b = 0;
        if (-1.0e-9 < d && d < +1.0e-9)
            d = 0;

        if (b == 0 && d == 0)
            return null;

        if (b == 0 && d == 0)
            return null;

        if (b == 0)
            return Point.create(preferredX, h / Math.abs(d));
        else if (d == 0)
            return Point.create(h / Math.abs(b), preferredY);

        let d1 = (b * d >= 0) ? d : -d;

        let s:Point;
        let x:number;
        let y:number;

        if (d1 != 0 && preferredX > 0) {
            let invD1 = 1 / d1;
            preferredX = Math.max(minX, Math.min(maxX, preferredX));
            x = preferredX;

            y = (h - b * x) * invD1;
            if (minY <= y && y <= maxY &&
                b * x + d1 * y >= 0) {
                s = Point.create(x, y);
            }

            y = (-h - b * x) * invD1;
            if (minY <= y && y <= maxY &&
                b * x + d1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                {
                    Point.release(s);
                    s = Point.create(x, y);
                }
            }
        }

        if (b != 0 && preferredY > 0) {
            let invB = 1 / b;
            preferredY = Math.max(minY, Math.min(maxY, preferredY));
            y = preferredY;

            x = ( h - d1 * y ) * invB;
            if (minX <= x && x <= maxX &&
                b * x + d1 * y >= 0) {
                if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                    s = Point.create(x, y);
            }

            x = ( -h - d1 * y ) * invB;
            if (minX <= x && x <= maxX &&
                b * x + d1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                {
                    Point.release(s);
                    s = Point.create(x, y);
                }
            }
        }

        if (s)
            return s;

        let a = matrix.a;
        let c = matrix.c;
        let c1 = ( a * c >= 0 ) ? c : -c;
        return solveEquation(b, d1, h, minX, minY, maxX, maxY, a, c1);
    }

    /**
     * @private
     */
    function calcUBoundsToFitTBoundsWidth(w:number,
                                          matrix:Matrix,
                                          preferredX:number,
                                          preferredY:number,
                                          minX:number,
                                          minY:number,
                                          maxX:number,
                                          maxY:number):Point {

        let a = matrix.a;
        let c = matrix.c;

        if (-1.0e-9 < a && a < +1.0e-9)
            a = 0;
        if (-1.0e-9 < c && c < +1.0e-9)
            c = 0;

        if (a == 0 && c == 0)
            return null;

        if (a == 0)
            return Point.create(preferredX, w / Math.abs(c));
        else if (c == 0)
            return Point.create(w / Math.abs(a), preferredY);

        let c1 = ( a * c >= 0 ) ? c : -c;

        let s:Point;
        let x:number;
        let y:number;

        if (c1 != 0 && preferredX > 0) {
            let invC1 = 1 / c1;
            preferredX = Math.max(minX, Math.min(maxX, preferredX));
            x = preferredX;

            y = (w - a * x) * invC1;
            if (minY <= y && y <= maxY &&
                a * x + c1 * y >= 0) {
                s = Point.create(x, y);
            }

            y = (-w - a * x) * invC1;
            if (minY <= y && y <= maxY &&
                a * x + c1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height)
                {
                    Point.release(s);
                    s = Point.create(x, y);
                }
            }
        }

        if (a != 0 && preferredY > 0) {
            let invA = 1 / a;
            preferredY = Math.max(minY, Math.min(maxY, preferredY));
            y = preferredY;

            x = (w - c1 * y ) * invA;
            if (minX <= x && x <= maxX &&
                a * x + c1 * y >= 0) {
                if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height)
                {
                    Point.release(s);
                    s = Point.create(x, y);
                }
            }

            x = (-w - c1 * y ) * invA;
            if (minX <= x && x <= maxX &&
                a * x + c1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height)
                {
                    Point.release(s);
                    s = Point.create(x, y);
                }
            }
        }

        if (s)
            return s;

        let b = matrix.b;
        let d = matrix.d;
        let d1 = (b * d >= 0) ? d : -d;
        return solveEquation(a, c1, w, minX, minY, maxX, maxY, b, d1);
    }

    /**
     * @private
     */
    function solveEquation(a:number,
                           c:number,
                           w:number,
                           minX:number,
                           minY:number,
                           maxX:number,
                           maxY:number,
                           b:number,
                           d:number):Point {
        if (a == 0 || c == 0)
            return null;

        let x:number;
        let y:number;

        let A = (w - minX * a) / c;
        let B = (w - maxX * a) / c;
        let rangeMinY = Math.max(minY, Math.min(A, B));
        let rangeMaxY = Math.min(maxY, Math.max(A, B));
        let det = (b * c - a * d);

        if (rangeMinY <= rangeMaxY) {
            if (Math.abs(det) < 1.0e-9) {
                y = w / ( a + c );
            }
            else {
                y = b * w / det;
            }

            y = Math.max(rangeMinY, Math.min(y, rangeMaxY));

            x = (w - c * y) / a;
            return Point.create(x, y);
        }

        A = -(minX * a + w) / c;
        B = -(maxX * a + w) / c;
        rangeMinY = Math.max(minY, Math.min(A, B));
        rangeMaxY = Math.min(maxY, Math.max(A, B));

        if (rangeMinY <= rangeMaxY) {
            if (Math.abs(det) < 1.0e-9) {
                y = -w / ( a + c );
            }
            else {
                y = -b * w / det;
            }

            y = Math.max(rangeMinY, Math.min(y, rangeMaxY));
            x = (-w - c * y) / a;
            return Point.create(x, y);

        }
        return null;
    }

    /**
     * @private
     */
    function calcUBoundsToFitTBounds(w:number,
                                     h:number,
                                     matrix:Matrix,
                                     minX:number,
                                     minY:number,
                                     maxX:number,
                                     maxY:number):Point {

        let a = matrix.a;
        let b = matrix.b;
        let c = matrix.c;
        let d = matrix.d;

        if (-1.0e-9 < a && a < +1.0e-9)
            a = 0;
        if (-1.0e-9 < b && b < +1.0e-9)
            b = 0;
        if (-1.0e-9 < c && c < +1.0e-9)
            c = 0;
        if (-1.0e-9 < d && d < +1.0e-9)
            d = 0;

        if (b == 0 && c == 0) {
            if (a == 0 || d == 0)
                return null;

            return Point.create(w / Math.abs(a), h / Math.abs(d));
        }

        if (a == 0 && d == 0) {
            if (b == 0 || c == 0)
                return null;

            return Point.create(h / Math.abs(b), w / Math.abs(c));
        }

        let c1 = ( a * c >= 0 ) ? c : -c;
        let d1 = ( b * d >= 0 ) ? d : -d;

        let det = a * d1 - b * c1;
        if (Math.abs(det) < 1.0e-9) {
            if (c1 == 0 || a == 0 || a == -c1)
                return null;

            if (Math.abs(a * h - b * w) > 1.0e-9)
                return null;

            return solveEquation(a, c1, w, minX, minX, maxX, maxY, b, d1);
        }

        let invDet = 1 / det;
        w *= invDet;
        h *= invDet;

        let s:Point;
        s = solveSystem(a, c1, b, d1, w, h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x >= 0 &&
            b * s.x + d1 * s.y >= 0)
            return s;

        s = solveSystem(a, c1, b, d1, w, -h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x >= 0 &&
            b * s.x + d1 * s.y < 0)
            return s;

        s = solveSystem(a, c1, b, d1, -w, h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x < 0 &&
            b * s.x + d1 * s.y >= 0)
            return s;

        s = solveSystem(a, c1, b, d1, -w, -h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x < 0 &&
            b * s.x + d1 * s.y < 0)
            return s;

        Point.release(s);
        return null;
    }

    /**
     * @private
     */
    function transformSize(width:number, height:number, matrix:Matrix):Rectangle {

        let bounds = $TempRectangle.setTo(0, 0, width, height);
        matrix.$transformBounds(bounds);
        return bounds;
    }

    /**
     * @private
     */
    function solveSystem(a:number,
                         c:number,
                         b:number,
                         d:number,
                         mOverDet:number,
                         nOverDet:number):Point {
        return Point.create(d * mOverDet - c * nOverDet,
            a * nOverDet - b * mOverDet);
    }